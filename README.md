# @openfonts-jp/registration-form

> フォント登録用の Google Form のための Google Apps Script

## Install

1. Google Form を作成する
2. コードをビルドする
    ```bash
    yarn && yarn build
    ```
3. `dist/bundle.js` を Google Apps Script Editor に貼り付ける
4. 環境変数を「スクリプトのプロパティ」に追加する
    - `GITHUB_TOKEN`
    - `GITHUB_REPO_OWNER`
    - `GITHUB_REPO_NAME`
5. `setup` 関数を実行する

## Usage

フォームが送信されると，その情報から JSON を追加して， PR を作ります．

## Contribute

PRs accepted.

## License

MIT (c) 3846masa
