module.exports = {
  root: true,
  env: {
    browser: true
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/standard'
  ],
  globals: {
    api: false,
    $api: false
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2019,
    sourceType: 'module'
  },
  rules: {
    /*
      @description 缩进风格
      */
    indent: [2, 2, {
      SwitchCase: 1
    }],
    /*
      @description 不要求使用 === 和 !==
      */
    eqeqeq: 0,
    /*
      @description 变量是一起声明
      */
    'one-var': [1, 'consecutive'],
    /*
      @description 生产环境不得使用console和debugger
      */
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    /*
      @description 关闭括号是否新起一行
      @see {@link = https://eslint.vuejs.org/rules/html-closing-bracket-newline.html}
      */
    'vue/html-closing-bracket-newline': [2, {
      singleline: 'never',
      multiline: 'never'
    }],
    /*
      @description 配置每一行属性最大的数量
      @see {@link = https://eslint.vuejs.org/rules/max-attributes-per-line.html}
      */
    'vue/max-attributes-per-line': [2, {
      singleline: 5, // 每行最大的属性数，multiline.allowFirstLine = true时，并且标签和属性写在同一行时生效
      multiline: {
        max: 5, // 每行最大的属性数
        allowFirstLine: true // 是否允许属性和标签名在同一行
      }
    }],
    /*
      @description 属性的排列顺序
      @see {@link = https://eslint.vuejs.org/rules/attributes-order.html}
      */
    'vue/attributes-order': [2, {
      order: [
        'DEFINITION',
        'LIST_RENDERING',
        'CONDITIONALS',
        'RENDER_MODIFIERS',
        'GLOBAL',
        'UNIQUE',
        'TWO_WAY_BINDING',
        'OTHER_DIRECTIVES',
        'EVENTS',
        'CONTENT',
        'OTHER_ATTR' // 把其它放到了最后面
      ]
    }],
    /*
      @description 关闭XSS攻击的警告
      @see {@link = https://eslint.vuejs.org/rules/no-v-html.html}
      */
    'vue/no-v-html': [0]
  }
}
