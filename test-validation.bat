@echo off
echo 🚀 开始运行所有验证测试
echo.

echo 📋 运行基础验证测试...
npx tsx src/shared/validation.test.ts

echo.
echo ---
echo.

echo 🔬 运行边界条件测试...
npx tsx src/shared/validation.boundary.test.ts

echo.
echo 🎉 所有测试完成！
pause