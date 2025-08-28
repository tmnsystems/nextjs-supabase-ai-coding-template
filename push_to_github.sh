#!/bin/bash

echo "================================="
echo "PUSH TO GITHUB - SIMPLE METHOD"
echo "================================="
echo ""
echo "To push your code to GitHub, you need a Personal Access Token:"
echo ""
echo "1. Go to: https://github.com/settings/tokens/new"
echo "2. Give it a name: 'push-template'"
echo "3. Select expiration (e.g., 7 days)"
echo "4. Check the 'repo' checkbox"
echo "5. Click 'Generate token' at the bottom"
echo "6. Copy the token (starts with ghp_)"
echo ""
read -p "Paste your token here and press Enter: " TOKEN

if [ -z "$TOKEN" ]; then
    echo "No token provided, exiting."
    exit 1
fi

echo ""
echo "Pushing to GitHub..."
git push https://$TOKEN@github.com/tmnsystems/nextjs-supabase-ai-coding-template.git main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Your code has been pushed to:"
    echo "https://github.com/tmnsystems/nextjs-supabase-ai-coding-template"
else
    echo ""
    echo "❌ Push failed. Please check your token and try again."
fi