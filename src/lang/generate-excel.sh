#!/bin/bash

ZH_FILE="./zh-CN/base.ts"
EN_FILE="./en-US/base.ts"
output_file="merged_translations.txt"

# 检查文件
for file in "$ZH_FILE" "$EN_FILE"; do
    [ ! -f "$file" ] && echo "错误: 文件 $file 不存在" && exit 1
    [ ! -r "$file" ] && echo "错误: 无法读取 $file" && exit 1
done

# 提取export default对象（处理多行和注释）
extract_export_default() {
    sed -e 's/\/\/.*$//' -e '/export default {/,/};/!d' -e 's/[ \t]*$//' "$1" | tr -d '\n'
}

# 提取键值对（兼容转义字符、复杂键名、多行值）
extract_key_values() {
    perl -ne 'while (/([a-zA-Z0-9_.-]+)\s*:\s*["\'](.*?)["\'](?:,\s*|$)/g) { print "$1:$2\n"; }' <<< "$1" | while IFS=: read -r key val; do
        key=$(echo "$key" | sed -e 's/^[ \t]*//' -e 's/[ \t]*$//')
        val=$(echo "$val" | sed -e 's/^[ \t]*["\']//' -e 's/["\'][, \t]*$//' -e 's/\\\\/\\/g')
        echo "$key:$val"
    done
}

# 处理内容并生成临时文件
process_file() {
    local content=$(extract_export_default "$1")
    local temp=$(mktemp)
    
    echo "$content" | while IFS=: read -r key val; do
        key=$(echo "$key" | sed -e 's/^[ \t]*//' -e 's/[ \t]*$//')
        val=$(echo "$val" | sed -e 's/^[ \t]*["\']//' -e 's/["\'][, \t]*$//' -e 's/\\\\/\\/g')
        echo "$key,$val" >> "$temp"
    done
    
    echo "$temp"
}

# 处理中英文文件
zh_temp=$(process_file "$ZH_FILE")
en_temp=$(process_file "$EN_FILE")

# 合并结果（按键排序确保join匹配）
sort "$zh_temp" > zh_sorted.tmp
sort "$en_temp" > en_sorted.tmp

echo "key,中文,英文" > "$output_file"
join -t, -j1 -a1 -a2 -e"缺失翻译" zh_sorted.tmp en_sorted.tmp >> "$output_file"
rm *.tmp

echo "合并完成，结果在 $output_file"
