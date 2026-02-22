#!/usr/bin/env node

// 使用动态导入来避免TypeScript编译问题
async function runTests() {
  // 动态导入TypeScript文件
  const { runAllTests } = await import('./src/shared/validation.test.js');
  const { runBoundaryTests } = await import('./src/shared/validation.boundary.test.js');

  console.log('🚀 开始运行所有验证测试\n');

  // 运行基础验证测试
  console.log('📋 运行基础验证测试...');
  runAllTests();

  console.log('\n---\n');

  // 运行边界条件测试
  console.log('🔬 运行边界条件测试...');
  runBoundaryTests();

  console.log('\n🎉 所有测试完成！');
}

// 运行测试
runTests().catch(console.error);