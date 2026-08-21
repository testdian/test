#!/bin/bash

# 权限批量添加脚本
# 使用方法: ./add_permission_batch.sh

# API配置
API_URL="https://lvmhpro-gateway-api-dev.carbonstop.com/system/permission/add"

# 请求头配置
AUTH_TOKEN="eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX2tleSI6IjEiLCJ1c2VybmFtZSI6ImFkbWluIiwic3ViIjoiY2FyYm9uZGN0In0.dxEHC14O4h0f6yzaB95vDUTcRu88MW8NrAybtDmqMek"

# 权限配置数组
# 格式: "权限名称|菜单类型|权限标识|排序号|备注|父ID"
permissions=(
  "编辑发送管理|F|/emailSendingRecord/edit|1|系统管理/邮件管理/发送管理/编辑|757"
  "查看发送管理|F|/emailSendingRecord/show|2|系统管理/邮件管理/发送管理/查看|757"
  "取消发送管理|F|/emailSendingRecord/cancel|3|系统管理/邮件管理/发送管理/取消发送|757"
  "重新发送管理|F|/emailSendingRecord/reload|4|系统管理/邮件管理/发送管理/重新发送|757"
)

# 创建临时文件
temp_file=$(mktemp)

# 遍历权限数组并执行API请求
for permission in "${permissions[@]}"; do
  # 分割权限配置
  IFS='|' read -r PERMISSION_NAME MENU_TYPE PERMS ORDER_NUM REMARK PID <<< "$permission"
  
  echo "正在添加权限: $PERMISSION_NAME"
  
  # 构建JSON请求体
  JSON_DATA=$(cat <<EOF
{
    "permissionName": "$PERMISSION_NAME",
    "menuType": "$MENU_TYPE",
    "perms": "$PERMS",
    "orderNum": "$ORDER_NUM",
    "remark": "$REMARK",
    "pid": $PID
}
EOF
)

  # 执行API请求，同时获取响应和状态码
  response=$(curl -s -w "%{http_code}" -o "$temp_file" -X POST "$API_URL" \
    -H "accept: application/json, text/plain, */*" \
    -H "accept-language: zh-CN,zh;q=0.9" \
    -H "authorization: $AUTH_TOKEN" \
    -H "cache-control: no-cache" \
    -H "content-type: application/json" \
    -H "origin: http://localhost:3005" \
    -H "pragma: no-cache" \
    -H "accountingModel-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36" \
    --data-raw "$JSON_DATA")

  # 从临时文件读取响应内容
  response_content=$(cat "$temp_file")
  
  # 输出结果
  if [ "$response" -eq 200 ]; then
    echo "权限添加成功!"
  else
    echo "权限添加失败，HTTP状态码: $response"
  fi
  
  echo "API响应:"
  echo "$response_content" | jq . 2>/dev/null || echo "$response_content"
  echo "----------------------------------------"
done

# 删除临时文件
rm -f "$temp_file"