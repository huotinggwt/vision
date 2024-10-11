module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/essential',
        'eslint:recommended',
        'plugin:prettier/recommended',
    ],
    parserOptions: {
        parser: '@babel/eslint-parser',
    },
    rules: {
        // 关闭未使用变量的警告/错误提示
        'no-unused-vars': 'off',
        // 关闭 Vue 组件名称必须是多单词的要求
        'vue/multi-word-component-names': 'off',
        // 关闭对变量必须使用驼峰命名法的检查
        camelcase: 'off',
        // 将 Prettier 的规则作为警告来对待，如果不符合 Prettier 的格式要求会抛出提示
        'prettier/prettier': 'off',
    },
}
