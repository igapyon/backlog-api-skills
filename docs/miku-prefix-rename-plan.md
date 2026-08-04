# miku プレフィックス名称変更実施計画

## 文書情報

| 項目 | 値 |
| --- | --- |
| 状態 | Draft / 未実施 |
| 作成日 | 2026-08-04 |
| 対象Issue | [`backlog-api` #21](https://github.com/igapyon/backlog-api/issues/21)、[`backlog-api-skills` #25](https://github.com/igapyon/backlog-api-skills/issues/25) |
| 基盤リポジトリ | `igapyon/backlog-api` |
| Skillsリポジトリ | `igapyon/backlog-api-skills` |
| 目的 | miku-softの命名規則に合わせ、基盤とAgent Skillsを安全に段階移行する |

> [!IMPORTANT]
> この文書は実施計画であり、ローカル変更、GitHub上の名称変更、push、
> PR merge、tag作成、Release公開を承認するものではない。
> 各承認ゲートで人間が明示的に承認するまで、次の段階へ進まない。

## 1. 目標

次の順序で正式名称を変更する。

```text
backlog-api Issue #21で名称・互換方針を決定
  -> 基盤をmiku-backlog-apiへ変更して移行Releaseを公開
  -> Skillsが新しい基盤Releaseを取り込む
  -> backlog-api-skillsをmiku-backlog-api-skillsへ変更
  -> Issue #21と#25へ結果を記録
```

GitHubリポジトリ名、package名、Release asset名は新名称へ移行する。
インストール済みSkill名、機械可読識別子、環境変数、ローカルhandoffは
別契約として扱い、最初の移行で一括置換しない。

## 2. 対象名称とWave 1の互換方針

以下をWave 1の推奨方針とする。承認ゲートG0で確定する。

| 契約 | 現在 | Wave 1の正式名称 | Wave 1の互換方針 |
| --- | --- | --- | --- |
| 基盤GitHubリポジトリ | `igapyon/backlog-api` | `igapyon/miku-backlog-api` | GitHub上でin-place rename |
| 基盤package | `backlog-api` | `miku-backlog-api` | 変更 |
| 基盤CLI | `backlog-api` | `miku-backlog-api` | 旧CLI名をaliasとして維持 |
| 基盤bundle | `backlog-api*.mjs` | `miku-backlog-api*.mjs` | 移行Releaseに旧名assetも併載 |
| 基盤source archive | `backlog-api-sources-*` | `miku-backlog-api-sources-*` | 移行Releaseに旧名assetも併載 |
| 環境変数 | `BACKLOG_API_*` | 変更なし | 維持 |
| operation名 | `get_issue`など | 変更なし | 上流互換契約として維持 |
| `product/toolset/origin` | `backlog-api` | 変更なし | 機械可読契約として維持 |
| verbose event type | `backlog-api-access` | 変更なし | 機械可読契約として維持 |
| Skills GitHubリポジトリ | `igapyon/backlog-api-skills` | `igapyon/miku-backlog-api-skills` | GitHub上でin-place rename |
| Skills package | `backlog-api-skills` | `miku-backlog-api-skills` | 変更 |
| Skills Release ZIP | `igapyon-backlog-api-skills-*` | `igapyon-miku-backlog-api-skills-*` | 移行Releaseに旧名ZIPも併載するかG0で確定 |
| インストールSkill名 | `igapyon-backlog-api` | 変更なし | Wave 1では維持 |
| Skillディレクトリ | `skills/igapyon-backlog-api/` | 変更なし | Wave 1では維持 |
| Skillトリガー | `backlog-api`系 | `miku-backlog-api`系を追加 | 新旧トリガーを併用 |
| runner schema | `backlog-api-skills.*` | 変更なし | schema変更は別Issue |
| handoff保存先 | `workplace/backlog-api-skill/` | 変更なし | 保留handoffとの互換性を維持 |

### 2.1 推奨する移行バージョン

- 基盤: `0.6.0`から次のminor版 `0.7.0`を候補とする。
- Skills: `0.6.2`から次のminor版 `0.7.0`を候補とする。
- 両者のversionは独立した契約だが、名称移行時は同じ番号を使うと追跡しやすい。
- 最終versionはG0で人間が決定する。

### 2.2 Wave 1の対象外

- `BACKLOG_API_*`環境変数のrename
- operation名のrename
- JSON envelopeやtrace schemaの破壊的変更
- `product/toolset/origin`のrename
- `backlog-api-skills.*` runner schemaのrename
- `workplace/backlog-api-skill/`の移動
- `igapyon-backlog-api` Skillディレクトリのrename
- 旧CLI alias、旧トリガー、旧assetの廃止

これらが必要な場合は、Wave 1完了後に別Issueと移行計画を作成する。

## 3. 役割と操作境界

### 3.1 人間のGitHub管理者

- GitHub Settingsでリポジトリ名を変更する。
- PRをmergeする。
- GitHub Release画面でtagとReleaseを作成または公開する。
- Actions、ruleset、secrets、webhook、Pages、Packagesの状態を確認する。
- 各リモート操作の承認ゲートを判断する。

### 3.2 実装担当Agent

- 明示承認後にローカルのtracked contentを変更する。
- miku-scmの対象workflow、branch規則、preflight、検証を使用する。
- GitHub上のリポジトリrenameを実行しない。
- `gh`を直接実行しない。
- 既存の無関係な変更を保持する。
- `-done` branchではtracked contentを変更しない。

### 3.3 レビュー担当

- 名称対応表、互換期間、成果物一覧をレビューする。
- 新旧CLIと新旧assetの互換テストを確認する。
- historical provenanceが書き換えられていないことを確認する。
- GitHub rename前後の記録を比較する。

## 4. 承認ゲート

| Gate | 承認内容 | 承認前に禁止されること |
| --- | --- | --- |
| G0 | 正式名称、Wave 1互換方針、version、互換Release数 | 実装開始 |
| G1 | 基盤rename-ready PRの内容と全検証結果 | 基盤GitHub rename、merge、Release |
| G2 | 基盤GitHub rename直前スナップショット | 基盤GitHub rename |
| G3 | 基盤rename後の検証と移行Release内容 | 基盤PR merge、tag、Release公開 |
| G4 | Skills rename-ready PRの内容と全検証結果 | Skills GitHub rename、merge、Release |
| G5 | Skills GitHub rename直前スナップショット | Skills GitHub rename |
| G6 | 両Release、redirect、CI、runtime連携の完了確認 | Issue完了記録、旧互換契約廃止 |

承認はGate間で引き継がない。GitHub renameの承認はPR mergeやRelease公開を
承認せず、PR mergeの承認はtagやRelease公開を承認しない。

## 5. Phase 0: 方針確定

### 5.1 G0チェックリスト

- [ ] 基盤の正式名称を `miku-backlog-api` と決定した。
- [ ] Skillsの正式名称を `miku-backlog-api-skills` と決定した。
- [ ] Wave 1ではSkill名 `igapyon-backlog-api` を維持すると決定した。
- [ ] Wave 1では機械可読識別子を維持すると決定した。
- [ ] Wave 1では `BACKLOG_API_*` を維持すると決定した。
- [ ] 基盤の移行versionを決定した。
- [ ] Skillsの移行versionを決定した。
- [ ] 基盤の旧名Release assetを何Release維持するか決定した。
- [ ] Skillsの旧名ZIPを何Release維持するか決定した。
- [ ] GitHub rename実施者と実施時間帯を決定した。
- [ ] Issue #21を基盤側の決定元、Issue #25をSkills側の追随先と確認した。

### 5.2 G0記録欄

```text
承認日時:
承認者:
基盤version:
Skills version:
旧名asset互換Release数:
旧名ZIP互換Release数:
補足:
```

## 6. Phase 1: 改名前監査

### 6.1 共通リポジトリ状態

各リポジトリでmiku-scmのREADONLY `repository.status`を実行し、次を記録する。

- [ ] branch名
- [ ] HEADの完全なSHA
- [ ] upstream branch
- [ ] ahead/behindが`0/0`であること
- [ ] staged、unstaged、untracked、conflictedがないこと
- [ ] branchが`-done`でないこと

実行例:

```bash
node <miku-scm-skill-root>/scripts/miku-scm-run.mjs \
  --format human repository.status
```

### 6.2 ローカル名称棚卸し

基盤リポジトリ:

```bash
rg -n --hidden \
  --glob '!**/.git/**' \
  --glob '!**/node_modules/**' \
  --glob '!**/bundle/**' \
  --glob '!**/dist/**' \
  --glob '!**/workplace/**' \
  'backlog-api|igapyon/backlog-api' .
```

Skillsリポジトリ:

```bash
rg -n --hidden \
  --glob '!**/.git/**' \
  --glob '!**/node_modules/**' \
  --glob '!**/bundle/**' \
  --glob '!**/workplace/**' \
  'backlog-api-skills|igapyon-backlog-api|igapyon/backlog-api|backlog-api-' .
```

- [ ] package/package-lockを棚卸しした。
- [ ] README、TODO、docsを棚卸しした。
- [ ] source、scripts、testsを棚卸しした。
- [ ] GitHub Actionsを棚卸しした。
- [ ] runtime source recordを棚卸しした。
- [ ] generated indexを棚卸しした。
- [ ] runner schemaとhandoff保存先を棚卸しした。

### 6.3 GitHub外部参照監査

GitHubのWeb UIまたはmiku-scmで許可されたREADONLY経路を使用する。
Agentは`gh`を直接実行しない。

検索対象:

```text
"igapyon/backlog-api"
"igapyon/backlog-api-skills"
"github.com/igapyon/backlog-api"
"github.com/igapyon/backlog-api-skills"
"uses: igapyon/backlog-api"
"uses: igapyon/backlog-api-skills"
```

- [ ] READMEやdocsからの外部リンクを一覧化した。
- [ ] Release assetへの直接リンクを一覧化した。
- [ ] clone/install手順を一覧化した。
- [ ] GitHub Actionまたはreusable workflowとしての外部利用有無を確認した。
- [ ] 外部利用者ごとの更新方法と担当を決めた。

> [!CAUTION]
> GitHubはrenameされたリポジトリを参照するActionやreusable workflowを
> redirectしない。該当する外部利用が見つかった場合はin-place renameを停止し、
> 新リポジトリ作成と旧リポジトリarchiveを含む別計画を検討する。
> 詳細は[GitHub公式のリポジトリrename仕様](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository)を参照する。

### 6.4 GitHub設定スナップショット

基盤とSkillsのそれぞれについて記録する。

- [ ] default branch
- [ ] Open PR一覧
- [ ] Open Issue一覧
- [ ] tag一覧
- [ ] Release一覧とasset名
- [ ] ruleset / branch protection
- [ ] Actions permissions
- [ ] Actions secrets / variables / environmentsの存在
- [ ] webhook / GitHub Apps / deploy keysの存在
- [ ] GitHub Pagesの有効・無効
- [ ] GitHub Packagesの有無
- [ ] About、description、website URL

秘密値は記録しない。設定項目の存在と再確認結果だけを記録する。

### 6.5 ローカルhandoff監査

- [ ] `workplace/backlog-api-skill/delete-handoffs/`に保留handoffがあるか確認した。
- [ ] 保留handoffを完了、dismiss、維持のどれにするか決定した。
- [ ] Wave 1でschemaと保存先を変更しないことを再確認した。
- [ ] credentialやBacklog API keyを読み取っていない。

## 7. Phase 2: 基盤rename-ready実装

対象: `igapyon/backlog-api`

### 7.1 変更対象

- [ ] `package.json`の`name`を`miku-backlog-api`へ変更した。
- [ ] `package-lock.json`を通常のnpm操作で同期した。
- [ ] `bin`へ`miku-backlog-api`を追加した。
- [ ] `backlog-api` bin aliasを維持した。
- [ ] CLI helpの正式コマンドを`miku-backlog-api`へ変更した。
- [ ] CLI helpに旧`backlog-api` aliasを明記した。
- [ ] build出力を次の正式名へ変更した。

```text
bundle/miku-backlog-api.mjs
bundle/miku-backlog-api-runtime.mjs
bundle/miku-backlog-api-sources.tgz
```

- [ ] 移行Release用の旧名assetも生成した。

```text
backlog-api-<version>.mjs
backlog-api-runtime-<version>.mjs
backlog-api-sources-<version>.tgz
```

- [ ] GitHub Actionsのrelease asset名を更新した。
- [ ] READMEのproject名、CLI例、成果物名を更新した。
- [ ] docs、TODO、traceability文書を更新した。
- [ ] 自リポジトリURLを新URLへ変更した。
- [ ] Skills側URLはSkills GitHub rename完了まで旧URLを維持した。
- [ ] generated traceabilityを正規コマンドで再生成した。

### 7.2 Wave 1で変更しないもの

- [ ] `BACKLOG_API_*`を変更していない。
- [ ] operation名を変更していない。
- [ ] `product.name`など機械可読な`backlog-api`識別子を変更していない。
- [ ] `toolset`と`origin`を変更していない。
- [ ] `backlog-api-access` event typeを変更していない。
- [ ] JSON envelope schemaを変更していない。

正式表示名と機械可読識別子を分ける実装が必要な場合は、既存識別子を
上書きせずdisplay nameまたはrepository metadataを追加する。

### 7.3 基盤テスト

```bash
npm ci
npm run typecheck
npm run trace:refresh
npm test
npm run smoke:node
```

- [ ] 新CLI名で`--version`が成功した。
- [ ] 新CLI名で`--help`が成功した。
- [ ] 旧CLI aliasで`--version`が成功した。
- [ ] 旧CLI aliasで`--help`が成功した。
- [ ] 新旧CLIが同じversionと操作カタログを返した。
- [ ] 新正式bundleが生成された。
- [ ] 移行用旧名assetが生成された。
- [ ] source archiveへ秘密情報や`workplace/`が混入していない。
- [ ] 全テストが成功した。
- [ ] final diffに無関係な変更がない。

### 7.4 G1記録欄

```text
PR URL:
commit range:
基盤version:
検証日時:
検証結果:
既知の警告:
承認者:
```

G1承認後もPRをmergeせず、Phase 3のGitHub renameへ進む。

## 8. Phase 3: 基盤GitHubリポジトリrename

対象変更:

```text
https://github.com/igapyon/backlog-api
  -> https://github.com/igapyon/miku-backlog-api
```

### 8.1 G2直前条件

- [ ] `igapyon/miku-backlog-api`が利用可能である。
- [ ] GitHub管理者権限を確認した。
- [ ] G1が承認済みである。
- [ ] default branch、HEAD、PR、Issue、tag、Releaseを記録した。
- [ ] 外部Action/reusable workflow利用がない、または移行方法が確定している。
- [ ] Pagesの影響を確認した。
- [ ] rename時間帯を関係者へ共有した。
- [ ] rename中のmergeとRelease公開を停止した。

### 8.2 人間がGitHub UIで実行する操作

1. `igapyon/backlog-api`を開く。
2. `Settings`を開く。
3. `Repository name`へ`miku-backlog-api`を入力する。
4. `Rename`を実行する。

Agentはこの操作を実行しない。

### 8.3 rename直後の確認

- [ ] 新URLが成功する。
- [ ] 旧URLが新URLへredirectされる。
- [ ] Issue #21が新URLで開ける。
- [ ] Open PRが保持されている。
- [ ] default branchとHEADが一致する。
- [ ] tagとReleaseが保持されている。
- [ ] Actions workflowが表示される。
- [ ] ruleset、secrets、variables、environmentsが保持されている。
- [ ] webhook、Apps、deploy keysの状態を確認した。
- [ ] About、description、website URLを確認した。

GitHubのredirectへ依存し続けず、主要cloneのremoteを新URLへ更新する。

```bash
git remote set-url origin git@github.com:igapyon/miku-backlog-api.git
git remote -v
git ls-remote origin HEAD
```

remote更新はローカルGit設定の変更なので、G2の明示承認後だけ実行する。
手順は[GitHub公式のremote URL変更方法](https://docs.github.com/en/get-started/git-basics/managing-remote-repositories)に従う。

- [ ] CIを新リポジトリ名の状態で再実行した。
- [ ] rename-ready PRのcheckが成功した。
- [ ] 旧名`backlog-api`のリポジトリを新規作成していない。

### 8.4 G3と基盤Release

G3承認後に人間が実行する。

- [ ] rename-ready PRをmergeした。
- [ ] merge commitを記録した。
- [ ] 正式versionのtagをGitHub Release画面で作成または選択した。
- [ ] Releaseを公開した。
- [ ] 新正式assetを確認した。
- [ ] 旧互換assetを確認した。
- [ ] `SHA256SUMS`と各assetのchecksumを確認した。
- [ ] 新URLからassetをdownloadできる。
- [ ] 旧Release URLのredirectを確認した。

記録:

```text
rename日時:
実施者:
旧URL:
新URL:
merge commit:
tag:
Release URL:
asset一覧:
checksum確認結果:
```

## 9. Phase 4: Skills rename-ready実装

対象: `igapyon/backlog-api-skills`

Phase 3の基盤Releaseが公開・検証済みになるまで開始しない。

### 9.1 package、bundle、GitHub Actions

- [ ] `package.json`の`name`を`miku-backlog-api-skills`へ変更した。
- [ ] `package-lock.json`を通常のnpm操作で同期した。
- [ ] bundle rootのrepo名を`miku-backlog-api-skills`へ変更した。
- [ ] 正式ZIP名を次へ変更した。

```text
igapyon-miku-backlog-api-skills-<version>.zip
```

- [ ] G0の決定に従い、移行用旧名ZIPを生成した。
- [ ] `.github/workflows/release-build.yml`のasset名を更新した。
- [ ] CIのNode.js 22/24契約を維持した。

### 9.2 runtime取得・provenance

- [ ] import scriptが`miku-backlog-api-<version>.mjs`を受け付ける。
- [ ] sync scriptが`miku-backlog-api` packageを検証する。
- [ ] sync scriptが新しいsister directory名を解決する。
- [ ] runtime resolverが新正式artifactを選択する。
- [ ] 移行期間に旧artifactが存在しても選択結果が決定的である。
- [ ] source recordのファイル役割を維持した。
- [ ] 新基盤Releaseの正式assetを取り込んだ。
- [ ] source recordへ新GitHub URL、tag、commit、asset URL、SHA-256を記録した。
- [ ] 既存Releaseとhistorical source recordを書き換えていない。

実行例。値はPhase 3の確定値を使用する。

```bash
npm run import:runtime:release -- \
  --version <base-version> \
  --tag <base-tag> \
  --commit <base-full-commit-sha> \
  --artifact /path/to/miku-backlog-api-<base-version>.mjs \
  --expected-sha256 <base-asset-sha256>
```

### 9.3 Skill契約

- [ ] `skills/igapyon-backlog-api/`をrenameしていない。
- [ ] `SKILL.md` frontmatterの`name: igapyon-backlog-api`を維持した。
- [ ] `agents/openai.yaml`のSkill名を維持した。
- [ ] `miku-backlog-api`トリガーを追加した。
- [ ] `miku-backlog-api-skills`トリガーを追加した。
- [ ] `igapyon-miku-backlog-api`を将来名候補として追加するかG0の決定に従った。
- [ ] 旧`igapyon-backlog-api`トリガーを維持した。
- [ ] 旧`backlog-api`トリガーを維持した。
- [ ] 旧`backlog-api-skills`トリガーを維持した。
- [ ] genericな`Backlog`だけではactivateしない境界を維持した。

### 9.4 runnerとhandoff互換性

- [ ] runner filenameを変更していない。
- [ ] workflow manifestのoperation IDを変更していない。
- [ ] `backlog-api-skills.runner/v1`を変更していない。
- [ ] Issue delete handoff schemaを変更していない。
- [ ] `workplace/backlog-api-skill/delete-handoffs/`を変更していない。
- [ ] 既存handoffのdigest計算を変更していない。
- [ ] 新しいbranding表示と内部schema IDを混同していない。

### 9.5 文書と生成index

- [ ] READMEのrepository名を更新した。
- [ ] READMEの基盤URLを新URLへ更新した。
- [ ] READMEへ旧名称互換方針を記載した。
- [ ] docs/development.mdのtrace chainを更新した。
- [ ] TODOの旧名称参照を意図に応じて更新した。
- [ ] runtime referenceとsetup例を更新した。
- [ ] THIRD_PARTY_NOTICESのartifact名を更新した。
- [ ] generated indexを正規手順で再生成した。

```bash
miku-indexgen --refresh-index skills/igapyon-backlog-api/index.json
```

### 9.6 Skillsテスト

```bash
npm ci
npm test
npm run smoke:runtime
npm run build:bundle:zip
```

- [ ] runtime source testが新URL、新asset名、新checksumを確認した。
- [ ] skill contract testが新旧triggerを確認した。
- [ ] runner contract testが既存schemaを確認した。
- [ ] release bundle contents testが新正式ZIPを確認した。
- [ ] isolated bundle smokeがinstall後のruntimeを実行した。
- [ ] 新正式ZIPに必要なSkillファイルとruntimeが含まれる。
- [ ] 旧互換ZIPを生成する場合、内容が正式ZIPと同等である。
- [ ] `tests/`、`workplace/`、`.DS_Store`、秘密情報がZIPへ入っていない。
- [ ] final diffに無関係な変更がない。

### 9.7 G4記録欄

```text
PR URL:
commit range:
Skills version:
取り込んだ基盤tag:
取り込んだ基盤commit:
runtime SHA-256:
検証日時:
検証結果:
既知の警告:
承認者:
```

G4承認後もPRをmergeせず、Phase 5のGitHub renameへ進む。

## 10. Phase 5: Skills GitHubリポジトリrename

対象変更:

```text
https://github.com/igapyon/backlog-api-skills
  -> https://github.com/igapyon/miku-backlog-api-skills
```

### 10.1 G5直前条件

- [ ] `igapyon/miku-backlog-api-skills`が利用可能である。
- [ ] GitHub管理者権限を確認した。
- [ ] G4が承認済みである。
- [ ] default branch、HEAD、PR、Issue、tag、Releaseを記録した。
- [ ] 外部Action/reusable workflow利用がない、または移行方法が確定している。
- [ ] Pagesの影響を確認した。
- [ ] rename時間帯を共有した。
- [ ] rename中のmergeとRelease公開を停止した。

### 10.2 人間がGitHub UIで実行する操作

1. `igapyon/backlog-api-skills`を開く。
2. `Settings`を開く。
3. `Repository name`へ`miku-backlog-api-skills`を入力する。
4. `Rename`を実行する。

Agentはこの操作を実行しない。

### 10.3 rename直後の確認

- [ ] 新URLが成功する。
- [ ] 旧URLが新URLへredirectされる。
- [ ] Issue #25が新URLで開ける。
- [ ] Open PRが保持されている。
- [ ] default branchとHEADが一致する。
- [ ] tagとReleaseが保持されている。
- [ ] CIとrelease workflowが表示される。
- [ ] ruleset、secrets、variables、environmentsが保持されている。
- [ ] webhook、Apps、deploy keysの状態を確認した。
- [ ] About、description、website URLを確認した。

主要cloneのremoteを更新する。

```bash
git remote set-url origin git@github.com:igapyon/miku-backlog-api-skills.git
git remote -v
git ls-remote origin HEAD
```

- [ ] CIを新リポジトリ名の状態で再実行した。
- [ ] rename-ready PRのcheckが成功した。
- [ ] 旧名`backlog-api-skills`のリポジトリを新規作成していない。

### 10.4 Skills PR mergeとRelease

G5のrename後確認と、PR check成功を人間がレビューしてから実行する。

- [ ] rename-ready PRをmergeした。
- [ ] merge commitを記録した。
- [ ] 正式versionのtagをGitHub Release画面で作成または選択した。
- [ ] Releaseを公開した。
- [ ] 新正式ZIPを確認した。
- [ ] G0で決めた旧互換ZIPを確認した。
- [ ] ZIPのchecksumを確認した。
- [ ] 新URLからZIPをdownloadできる。
- [ ] 旧Release URLのredirectを確認した。

記録:

```text
rename日時:
実施者:
旧URL:
新URL:
merge commit:
tag:
Release URL:
ZIP一覧:
checksum確認結果:
```

## 11. Phase 6: 連携・外部参照の切替

- [ ] 基盤READMEのSkillsリンクを正式な新URLへ変更した。
- [ ] Skills READMEの基盤リンクが正式な新URLを指す。
- [ ] docs、TODO、traceabilityのcanonical URLを更新した。
- [ ] GitHub Aboutのdescriptionとwebsite URLを更新した。
- [ ] 外部README、インストール手順、clone URLの更新依頼を完了した。
- [ ] Action/reusable workflow利用者がいる場合、全参照を更新した。
- [ ] 主要なローカルcloneのremoteを更新した。
- [ ] CIやローカルscriptがredirectへ依存していない。
- [ ] 旧GitHubリポジトリ名を再利用していない。

GitHubは通常、旧Web URL、Issue、Wiki、clone/fetch/pushを新名称へredirectするが、
GitHub Pagesのproject site URLとAction/reusable workflow参照には例外がある。
旧名称を別リポジトリで再利用するとredirectが失われるため、再利用しない。

## 12. Phase 7: G6完了確認

### 12.1 基盤

- [ ] canonical GitHub URLが`igapyon/miku-backlog-api`である。
- [ ] package名が`miku-backlog-api`である。
- [ ] 新CLIが成功する。
- [ ] 旧CLI aliasが成功する。
- [ ] 新正式assetが公開されている。
- [ ] G0で決めた旧互換assetが公開されている。
- [ ] checksumが一致する。
- [ ] CI、typecheck、trace、test、smokeが成功している。

### 12.2 Skills

- [ ] canonical GitHub URLが`igapyon/miku-backlog-api-skills`である。
- [ ] package名が`miku-backlog-api-skills`である。
- [ ] installed Skill名が`igapyon-backlog-api`のままである。
- [ ] 新旧triggerが同じSkillをactivateする。
- [ ] runtime source recordが新基盤Releaseを指す。
- [ ] 新正式ZIPが公開されている。
- [ ] G0で決めた旧互換ZIPが公開されている。
- [ ] CI、test、runtime smoke、bundle、isolated smokeが成功している。

### 12.3 GitHubと外部連携

- [ ] 旧Web URLがredirectされる。
- [ ] Issue #21と#25が新URLで開ける。
- [ ] 既存PR、tag、Releaseが保持されている。
- [ ] Actions、ruleset、secrets、webhookが正常である。
- [ ] 主要cloneのremoteが新URLを指す。
- [ ] 旧名称リポジトリが再作成されていない。
- [ ] 外部Action/reusable workflow参照が残っていない。

### 12.4 完了記録

Issueへのcomment、本文更新、closeはそれぞれ別のmiku-scm承認workflowで行う。
この文書の完了だけではGitHub Issueのmutationを承認しない。

- [ ] Issue #21へ採用理由、互換方針、実施結果を記録した。
- [ ] Issue #25へSkills側の名称対応、runtime連携、実施結果を記録した。
- [ ] 必要な後続Issueを作成した。
- [ ] Issue #21の完了条件を確認した。
- [ ] Issue #25の完了条件を確認した。
- [ ] 人間の承認後に各Issueをcloseした。

## 13. 停止条件

以下のいずれかが発生した場合、そのPhaseを停止する。

- 新しいGitHubリポジトリ名を利用できない。
- current branchが`-done`である。
- working treeがcleanでない、または無関係な変更が混在する。
- base branchとupstreamがdivergeしている。
- 外部Action/reusable workflow利用が見つかり、移行方法が未確定である。
- GitHub Pages、Packages、webhookなどの影響が未確認である。
- 新旧CLIの結果が意図せず異なる。
- traceability生成結果が不整合である。
- Release assetまたはZIPのchecksumが一致しない。
- Skills runtime source recordと実体が一致しない。
- 保留handoffを安全に扱えない。
- CI、test、smoke、bundle testが失敗する。
- rename後にIssue、PR、tag、Release、rulesetが欠落している。
- mutation結果が不明、競合、または未解決である。

停止後に対象や変更内容を推測して続行しない。原因、最後に確認できた状態、
未実施の操作を報告し、改めて人間の判断を待つ。

## 14. ロールバック方針

### 14.1 GitHub rename前

- PRをmergeしない。
- tagやReleaseを作成しない。
- rename-ready branchを保持して修正するか、通常のrevertで戻す。
- history rewriteやforce pushを自動実行しない。

### 14.2 GitHub rename直後、Release前

- criticalな問題がある場合はmergeとReleaseを停止する。
- 人間が旧名称の利用可能性とredirect状態を確認する。
- 必要な場合だけ、人間がGitHub Settingsで旧名称へ戻す。
- local remoteを戻す操作にも別の明示承認を必要とする。

### 14.3 Release公開後

- 公開済みtagを移動・削除しない。
- 公開済みRelease assetとhistorical provenanceを書き換えない。
- tracked contentはrevert PRまたは修正版PRで戻す。
- artifactの問題は新しい修正版Releaseで訂正する。
- GitHubリポジトリ名を戻す場合は、外部参照とredirectへの影響を再監査し、
  独立した承認計画を作る。
- 旧名称の空リポジトリを作ってredirectを上書きしない。

## 15. Wave 2候補

Wave 1完了後、必要性を評価して別Issue化する。

- `igapyon-backlog-api`から`igapyon-miku-backlog-api`へのSkill名変更
- Skillディレクトリ移動と旧インストール削除手順
- runner/schema IDのversion付きrename
- handoff保存先と既存handoff migration
- `product/toolset/origin`など機械可読識別子のrename
- `BACKLOG_API_*`環境変数aliasと廃止計画
- 旧CLI aliasの廃止
- 旧Release asset名と旧ZIP名の廃止

これらをWave 1へ追加しない。実施する場合は、互換期間、migration、
deprecation warning、テスト、rollbackを別途定義する。

## 16. 実行ログ

各作業時に追記する。秘密値、API key、credential、tenant dataは記録しない。

| 日時 | Phase / Gate | リポジトリ | branch / commit | 実施内容 | 結果 | 実施者 |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

## 17. 最終サマリー記入欄

```text
基盤旧URL:
基盤新URL:
基盤最終version/tag/commit:
基盤Release URL:

Skills旧URL:
Skills新URL:
Skills最終version/tag/commit:
Skills Release URL:

runtime source version/tag/commit/SHA-256:
旧互換CLIの期限:
旧互換assetの期限:
旧互換triggerの期限:

未解決事項:
後続Issue:
最終承認者:
完了日時:
```
