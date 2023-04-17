## 工程化

### 依赖安装

```bash
npm i eslint -D
npm i prettier -D
npm i eslint-config-prettier -D
```

### 格式化文件

- .eslintrc.js 文件，生成小程序项目自动生成

- prettier.config.js

  ```js
  module.exports = {
    arrowParens: 'avoid',
    endOfLine: 'auto',
    trailingComma: 'es5',
    printWidth: 120,
    semi: false,
    singleQuote: true,
  }
  ```

### 格式化命令

shift + alt + f：命令格式化

```json
{
  "scripts": {
    "lint": "prettier --write ./pages"
  }
}
```

### 小程序使用 scss

设置 project.config.json 下的 setting.useCompilerPlugins 为包含 sass 的数组

修改全部 wxss 为 scss 文件即可

```json
{
  "setting": {
    "useCompilerPlugins": ["sass"]
  }
}
```
