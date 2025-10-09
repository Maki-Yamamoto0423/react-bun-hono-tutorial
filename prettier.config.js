/** @type {import("prettier").Config} */
export default {
  semi: true, // 文末にセミコロンをつける
  singleQuote: true, // シングルクォートを使う
  trailingComma: 'es5', // 配列やオブジェクトの最後にもカンマ
  tabWidth: 2, // インデント幅
  printWidth: 100, // 1行あたりの最大文字数
  bracketSpacing: true, // { foo: bar } のようにスペースを入れる
  jsxSingleQuote: false, // JSXではダブルクォート
  arrowParens: 'avoid', // アロー関数の引数が1つなら()を省略
  plugins: ['prettier-plugin-tailwindcss'], // Tailwind CSS クラスを自動で並べ替えるプラグイン
};
