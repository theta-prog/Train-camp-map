
---

# キャンプ場検索Webアプリ コーディング手順

## 1. 技術スタック

* **フロントエンド:** React, Next.js
* **バックエンド (必要に応じて):** Node.js, TypeScript
    * 推奨フレームワーク: NestJS
* **開発環境:** VSCode

## 2. 開発環境の準備

* Node.js と npm (または yarn) をインストールしてください。
* VSCode をインストールしてください。
* VSCode の拡張機能として、ESLint、Prettier、TypeScript などをインストールすることを推奨します。

## 3. プロジェクトの初期設定

1.  **Next.js プロジェクトの作成:**
    ```bash
    npx create-next-app@latest campsite-search-app --typescript
    cd campsite-search-app
    ```

2.  **NestJS プロジェクトの作成 (バックエンドが必要な場合):**
    ```bash
    npm install -g @nestjs/cli
    nest new campsite-api
    cd campsite-api
    ```

## 4. 基本機能の実装 (段階的に)

1.  **地図表示機能の実装 (Next.js):**
    * `@react-google-maps/api` などのReact用Google Mapsライブラリをインストールします。
    * Google Maps Platform の APIキーを取得し、環境変数に設定します。
    * 地図を表示するコンポーネントを作成します。

2.  **キャンプ場データの表示 (Next.js):**
    * 初期段階では、JSONファイルなどでキャンプ場データを管理し、地図上にピンなどで表示する機能を実装します。
    * 手動登録機能の実装方法（例：地図クリックで座標を取得し、情報入力フォームを表示）を検討し、実装します。

3.  **公共交通機関情報の表示 (Next.js):**
    * Public Transportation Open Data Center API を利用するためのAPI連携処理を実装します。
    * 取得した鉄道やバスの路線データを地図上に重ねて表示する機能を実装します。
    * 駅やバス停のアイコン表示を行います。

4.  **キャンプ場詳細情報の表示 (Next.js):**
    * 地図上のキャンプ場ピンをクリックした際に、詳細情報を表示するコンポーネントを作成します。
    * 詳細情報には、キャンプ場名、住所、電話番号、公式サイトURL、料金、設備、アクティビティ、アクセス情報などを表示します。
    * 予約サイトへのリンクを表示します。

5.  **交通経路表示機能 (Next.js):**
    * 出発地（ユーザーの現在地または指定した駅）から目的のキャンプ場の最寄り駅までの公共交通機関の経路、費用、時間を計算し、表示する機能を実装します。Google Maps API の Directions Service や Public Transportation Open Data Center API の情報などを活用します。

## 5. 検索・絞り込み機能の実装 (Next.js):

* キーワード検索機能（キャンプ場名、地名など）を実装します。
* 絞り込み機能（価格帯、周辺施設、トイレの有無、レンタル機材など）を実装します。
* 絞り込み条件に応じて地図上の表示を更新する処理を実装します。

## 6. キャンプ場登録・編集機能の実装 (Next.js, NestJS):

* 管理者向けのキャンプ場登録・編集画面を作成します。
* 地図からの地点選択や、Google Maps Place API を利用した情報取得機能を実装します。
* バックエンド (NestJS) を使用する場合は、APIエンドポイントを作成し、データの保存・管理を行います。

## 7. 今後の展望

* ユーザーレビュー機能の実装
* お気に入り機能の実装
* オフライン機能の実装
* 多言語対応

## 8. コミュニケーションと進捗管理

* 実装中に疑問点や問題点が発生した場合は、随時質問し、解決に向けて協力します。
* 実装の進捗状況を定期的に共有し、認識のずれがないようにします。

---
