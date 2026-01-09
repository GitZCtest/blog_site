#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Nginx 自动配置脚本 ===${NC}"

# 1. 检查是否以 root 运行
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}请使用 sudo 运行此脚本: sudo ./setup_nginx.sh${NC}"
  exit 1
fi

# 2. 安装 Nginx
echo "正在检查 Nginx..."
if ! command -v nginx &> /dev/null; then
    echo "未检测到 Nginx，正在安装..."
    apt update
    apt install -y nginx
else
    echo -e "${GREEN}Nginx 已安装${NC}"
fi

# 3. 收集配置信息
echo ""
echo "------------------------------------------------"
echo "请回答以下问题来生成配置："
echo "------------------------------------------------"

# 博客配置
read -p "请输入博客的域名 (例如 blog.com，如果是纯IP访问请直接回车): " BLOG_DOMAIN
if [ -z "$BLOG_DOMAIN" ]; then
    BLOG_DOMAIN="_" # Nginx 的默认匹配
    echo "将使用 IP 模式访问博客。"
fi

read -p "请输入博客在本地运行的端口 (默认 3000): " BLOG_PORT
BLOG_PORT=${BLOG_PORT:-3000}

# Langflow 配置
echo ""
read -p "是否需要配置 Langflow 反向代理? (y/n): " SETUP_LANGFLOW

LANGFLOW_CONFIG=""
if [[ "$SETUP_LANGFLOW" =~ ^[Yy]$ ]]; then
    read -p "请输入 Langflow 的域名 (例如 ai.blog.com): " LANGFLOW_DOMAIN
    if [ -z "$LANGFLOW_DOMAIN" ]; then
        echo -e "${RED}错误: 配置 Langflow 必须指定一个子域名(因为 80 端口已经被博客占用)。${NC}"
        echo "跳过 Langflow 配置..."
    else
        read -p "请输入 Langflow Docker 映射出的端口 (默认 7860): " LANGFLOW_PORT
        LANGFLOW_PORT=${LANGFLOW_PORT:-7860}
        
        # 构建 Langflow 配置块
        LANGFLOW_CONFIG="
server {
    listen 80;
    server_name $LANGFLOW_DOMAIN;

    location / {
        proxy_pass http://localhost:$LANGFLOW_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}"
        echo -e "${GREEN}将在配置中添加 Langflow ($LANGFLOW_DOMAIN -> $LANGFLOW_PORT)${NC}"
    fi
fi

# 4. 生成配置文件
CONFIG_FILE="/etc/nginx/sites-available/my_unified_config"

echo ""
echo "正在生成配置文件: $CONFIG_FILE ..."

cat > "$CONFIG_FILE" <<EOF
# Next.js Blog Configuration
server {
    listen 80;
    server_name $BLOG_DOMAIN;

    location / {
        proxy_pass http://localhost:$BLOG_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}

$LANGFLOW_CONFIG
EOF

# 5. 启用配置
echo "正在启用新配置..."

# 移除 default 链接 (防止冲突)
if [ -L /etc/nginx/sites-enabled/default ]; then
    rm /etc/nginx/sites-enabled/default
    echo "已移除默认的 default 配置"
fi

# 创建软链接
ln -sf "$CONFIG_FILE" /etc/nginx/sites-enabled/

# 6. 测试并重启
echo "检查 Nginx 配置语法..."
if nginx -t; then
    echo -e "${GREEN}配置语法正确，正在重启 Nginx...${NC}"
    systemctl restart nginx
    echo ""
    echo -e "${GREEN}=== 部署完成! ===${NC}"
    echo "Blog 端口: $BLOG_PORT"
    if [ ! -z "$LANGFLOW_CONFIG" ]; then
        echo "Langflow 端口: $LANGFLOW_PORT (域名: $LANGFLOW_DOMAIN)"
    fi
else
    echo -e "${RED}Nginx 配置检查失败，请检查上方错误信息。${NC}"
    echo "未重启 Nginx。"
    exit 1
fi
