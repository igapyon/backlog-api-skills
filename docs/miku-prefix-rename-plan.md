# miku プレフィックス名称変更実施計画

## 文書情報

| 項目 | 値 |
| --- | --- |
| 状態 | 名称変更・Skills PR #32 merge・v0.7.3 Release公開済み・Issue #21/#25クローズ済み / GitHub管理設定は継続確認 |
| 作成日 | 2026-08-04 |
| 対象Issue | [`miku-backlog-api` #21](https://github.com/igapyon/miku-backlog-api/issues/21)、[`miku-backlog-api-skills` #25](https://github.com/igapyon/miku-backlog-api-skills/issues/25) |
| 基盤リポジトリ | `igapyon/miku-backlog-api` |
| Skillsリポジトリ | `igapyon/miku-backlog-api-skills` |
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

以下は、基盤CLI `miku-backlog-api` `v0.7.0` の公開Releaseで確認した方針と
整合させたWave 1の基準である。基盤のGitHub rename、PR merge、Release公開、
正式artifactとchecksumの検証は完了し、Skillsはこの公開済みruntimeへ追従する。

| 契約 | 現在 | Wave 1の正式名称 | Wave 1の互換方針 |
| --- | --- | --- | --- |
| 基盤GitHubリポジトリ | `igapyon/backlog-api` | `igapyon/miku-backlog-api` | GitHub上でin-place rename |
| 基盤package | `backlog-api` | `miku-backlog-api` | 変更 |
| 基盤CLI | `backlog-api` | `miku-backlog-api` | 旧CLI名をaliasとして維持 |
| 基盤bundle | `backlog-api*.mjs` | `miku-backlog-api*.mjs` | 新Releaseは正式assetだけを公開。historical Releaseの旧assetは維持 |
| 基盤source archive | `backlog-api-sources-*` | `miku-backlog-api-sources-*` | 新Releaseは正式assetだけを公開。historical Releaseの旧assetは維持 |
| 環境変数 | `BACKLOG_API_*` | 変更なし | 維持 |
| operation名 | `get_issue`など | 変更なし | 上流互換契約として維持 |
| `product/toolset/origin` | `backlog-api` | `miku-backlog-api` | 基盤CLI `0.7.0`で同時に移行 |
| verbose event type | `backlog-api-access` | `miku-backlog-api-access` | 基盤CLI `0.7.0`で同時に移行 |
| Skills GitHubリポジトリ | `igapyon/backlog-api-skills` | `igapyon/miku-backlog-api-skills` | GitHub上でin-place rename |
| Skills package | `backlog-api-skills` | `miku-backlog-api-skills` | 変更 |
| Skills Release ZIP | `igapyon-backlog-api-skills-*` | `igapyon-miku-backlog-api-skills-*` | 新Releaseは正式ZIPだけを公開。historical Releaseは維持 |
| インストールSkill名 | `igapyon-backlog-api` | `igapyon-miku-backlog-api` | 新旧のproduct/repository名称をtriggerとして維持 |
| Skillディレクトリ | `skills/igapyon-backlog-api/` | `skills/igapyon-miku-backlog-api/` | 正式Skill名と同時に移行 |
| Skillトリガー | `backlog-api`系 | `miku-backlog-api`系を追加 | 旧 `backlog-api`、`backlog-api-skills`、`igapyon-backlog-api` を併用 |
| runner schema | `backlog-api-skills.*` | 変更なし | schema変更は別Issue |
| handoff保存先 | `workplace/backlog-api-skill/` | 変更なし | 保留handoffとの互換性を維持 |

### 2.1 移行バージョンの順序

- 基盤CLI `v0.7.0` はGitHub rename後の最初のReleaseとして公開・検証済みである。
- Skillsは、公開済みの基盤CLI Releaseのtag、commit、正式artifact名、SHA-256を受領して追従する。
- Skillsは、package名とインストールSkill名の公開契約が変わるため、`0.7.0` へminor incrementする。
- Skillsは未公開CLI bundleをpinせず、公開済みの `miku-backlog-api` Releaseだけを取り込む。

### 2.2 Wave 1の対象外

- `BACKLOG_API_*`環境変数のrename
- operation名のrename
- JSON envelopeやtrace schemaの破壊的変更
- `backlog-api-skills.*` runner schemaのrename
- `workplace/backlog-api-skill/`の移動
- 旧CLI aliasと旧triggerの廃止
- historical Release assetまたはhistorical ZIPの変更・削除

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
| G0 | 正式名称、Wave 1互換方針、基盤CLI先行とSkills追従のversion順序 | Skills実装開始 |
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

- [x] 基盤の正式名称を `miku-backlog-api` と決定した。
- [x] Skillsの正式名称を `miku-backlog-api-skills` と決定した。
- [x] Wave 1でSkill名を `igapyon-miku-backlog-api` へ移行し、旧名称をtriggerとして維持すると決定した。
- [x] 基盤CLIの機械可読識別子は `miku-backlog-api` へ同時に移行すると決定した。
- [x] Wave 1では `BACKLOG_API_*` とoperation名を維持すると決定した。
- [x] 基盤CLI `0.7.0` のReleaseを先行し、そのReleaseをSkillsが追従する順序を決定した。
- [x] Skillsの移行versionを、基盤CLI Releaseの確認後に `0.7.0` と決定した。
- [x] 新Releaseへ旧名asset/ZIPを複製せず、historical Releaseは変更しないと決定した。
- [ ] GitHub rename実施者と実施時間帯を決定した。
- [ ] Issue #21を基盤側の決定元、Issue #25をSkills側の追随先と確認した。

### 5.2 G0記録欄

```text
承認日時:
承認者:
基盤CLI Release: v0.7.0（公開・検証済み）
Skills version: 0.7.0
旧名asset / ZIP: 新Releaseへ複製しない。historical Releaseは変更しない。
補足:
```

### 5.3 記録済みの順序決定

2026-08-04に、SkillsはCLI側のversion upgradeとRelease公開を先行させ、
公開済みartifactへ追従する方針を記録した。ローカルの未公開CLI bundleを
Skillsへ取り込まない。この方針はSkillsのversion番号を事前に固定しない。

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

### 6.6 2026-08-04 ローカル監査記録

この記録はREADONLY監査の結果であり、GitHub rename、merge、tag、Release、
runtime importを承認しない。

| 対象 | 確認結果 | 実装上の意味 |
| --- | --- | --- |
| Skills repository | `devel-tiga0804jef`、`07966b76a17182d125dce374c963a85e3c5e9a50`、`origin/devel`、ahead/behind `0/0`、clean | Phase 4を始める専用branchは基盤Release後に別途作成する。現branchへ実装を混在させない |
| 基盤CLI repository | `devel-tiga0731xdf`、`6502cda393443aaa7790dfe550e39f1583b7fb40`、upstreamとのahead/behind `0/0`、clean | `miku-backlog-api` `0.7.0` の準備branch。default branchへのmerge、GitHub rename、Releaseは未確認・未実施 |
| 基盤CLIの準備内容 | package、canonical CLI、bundle、`product/toolset/origin`、verbose event typeが `miku-backlog-api` へ移行済み。`backlog-api` CLI aliasは `0.7.x` で維持 | Skillsは公開済み `miku-backlog-api-*` artifactを取り込み、旧artifactはhistorical Release専用として解決する |
| Skillsのrename対象 | package/package-lock、bundle scripts、release workflow、README/docs、runtime import/sync/source record、runtime references、Skill directory/frontmatter/agent metadata、index、tests | display/package/runtime/provenance/installed Skillを一つの変更として扱う。runner schemaとhandoff pathは維持する |
| Skillsの現行互換契約 | `igapyon-backlog-api` directory/name、`backlog-api-skills.*` schema、`workplace/backlog-api-skill/delete-handoffs/`、`BACKLOG_API_*`、operation名 | Skill directory/nameだけはWave 1で移行し、旧product/repository名称はtriggerとして残す。他の列挙契約は変更しない |
| local handoff | `workplace/backlog-api-skill/delete-handoffs/` は存在しなかった。内容・credentialは読み取っていない | schema/path migrationは不要。ただし実装直前に再確認する |

SkillsリポジトリのCIには `uses: igapyon/...` 形式の参照は見つからず、
release workflowはbundle ZIP名とruntime source-record pathを直接参照している。
ただし、他リポジトリからのAction/reusable workflow利用、GitHub Settings、
Pages、Packages、webhook、secrets、Open PR/Issue、Release一覧はこのローカル監査の
対象外である。G2/G5の直前に、GitHub管理者がWeb UIで確認して記録する。

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

- [ ] 新Releaseには正式assetだけを生成し、旧名assetは複製していない。

- [ ] GitHub Actionsのrelease asset名を更新した。
- [ ] READMEのproject名、CLI例、成果物名を更新した。
- [ ] docs、TODO、traceability文書を更新した。
- [ ] 自リポジトリURLを新URLへ変更した。
- [ ] Skills側URLはSkills GitHub rename完了まで旧URLを維持した。
- [ ] generated traceabilityを正規コマンドで再生成した。

### 7.2 基盤CLIで保つ契約と移行する契約

- [ ] `BACKLOG_API_*`を変更していない。
- [ ] operation名を変更していない。
- [ ] `product.name`などの基盤CLI機械可読識別子を`miku-backlog-api`へ移行した。
- [ ] `toolset`と`origin`を`miku-backlog-api`へ移行した。
- [ ] verbose event typeを`miku-backlog-api-access`へ移行した。
- [ ] JSON envelope schemaを変更していない。

Skillsのrunner schemaおよびhandoff schemaは基盤CLIの識別子と別契約であり、
このPhaseでは変更しない。

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
- [ ] 新Releaseのasset一覧に旧名assetが含まれない。
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

- [x] rename-ready PRをmergeした。
- [x] merge commitを記録した。
- [x] 正式versionのtagをGitHub Release画面で作成または選択した。
- [x] Releaseを公開した。
- [x] 新正式assetを確認した。
- [x] 旧互換assetを確認した。
- [x] `SHA256SUMS`と各assetのchecksumを確認した。
- [x] 新URLからassetをdownloadできる。
- [x] 旧Release URLのredirectを確認した。

記録:

```text
rename日時: 2026-08-04（GitHub上の公開状態で確認）
実施者: 人間（GitHub管理操作）
旧URL: https://github.com/igapyon/backlog-api
新URL: https://github.com/igapyon/miku-backlog-api
merge commit: 2ee5cd26cd412906b771987e1491618d137ab993
tag: v0.7.0
Release URL: https://github.com/igapyon/miku-backlog-api/releases/tag/v0.7.0
asset一覧: miku-backlog-api-0.7.0.mjs、miku-backlog-api-runtime-0.7.0.mjs、source archive、SHA256SUMS
checksum確認結果: miku-backlog-api-0.7.0.mjs = 30ab58105b5c06c5b15fc932e1a4fe8b790c0d8cf32f57f0e10f51a76d31d872
```

## 9. Phase 4: Skills rename-ready実装

対象: `igapyon/backlog-api-skills`

Phase 3の基盤Releaseが公開・検証済みになるまで開始しない。

### 9.1 package、bundle、GitHub Actions

- [x] `package.json`の`name`を`miku-backlog-api-skills`へ変更した。
- [x] `package-lock.json`を通常のnpm操作で同期した。
- [x] bundle rootのrepo名を`miku-backlog-api-skills`へ変更した。
- [x] 正式ZIP名を次へ変更した。

```text
igapyon-miku-backlog-api-skills-<version>.zip
```

- [x] 新Release用bundleは正式ZIPだけを生成し、旧名ZIPを複製しない。
- [x] `.github/workflows/release-build.yml`のasset名を更新した。
- [x] CIのNode.js 22/24契約を維持した。

### 9.2 runtime取得・provenance

- [x] import scriptが`miku-backlog-api-<version>.mjs`を受け付ける。
- [x] sync scriptが`miku-backlog-api` packageを検証する。
- [x] sync scriptが新しいsister directory名を解決する。
- [x] runtime resolverがnew-name Releaseの正式artifactを選択する。
- [x] runtime resolverがhistorical Releaseの`backlog-api-*`とnew-name Releaseの`miku-backlog-api-*`を意図的かつ決定的に扱う。
- [x] source recordのファイル役割を維持した。
- [x] 新基盤Releaseの正式assetを取り込んだ。
- [x] source recordへ新GitHub URL、tag、commit、asset URL、SHA-256を記録した。
- [x] 公開済みRelease、asset、checksumを変更していない。現行source recordは公開済みの新runtimeだけを記録する。

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

- [x] `skills/igapyon-backlog-api/`を`skills/igapyon-miku-backlog-api/`へrenameした。
- [x] `SKILL.md` frontmatterの`name`を`igapyon-miku-backlog-api`へ変更した。
- [x] `agents/openai.yaml`のSkill名を`igapyon-miku-backlog-api`へ変更した。
- [x] `miku-backlog-api`トリガーを追加した。
- [x] `miku-backlog-api-skills`トリガーを追加した。
- [x] `igapyon-miku-backlog-api` triggerを正式名として追加した。
- [x] 旧`igapyon-backlog-api`トリガーを維持した。
- [x] 旧`backlog-api`トリガーを維持した。
- [x] 旧`backlog-api-skills`トリガーを維持した。
- [x] genericな`Backlog`だけではactivateしない境界を維持した。

### 9.4 runnerとhandoff互換性

- [x] runner filenameを変更していない。
- [x] workflow manifestのoperation IDを変更していない。
- [x] `backlog-api-skills.runner/v1`を変更していない。
- [x] Issue delete handoff schemaを変更していない。
- [x] `workplace/backlog-api-skill/delete-handoffs/`を変更していない。
- [x] 既存handoffのdigest計算を変更していない。
- [x] 新しいbranding表示と内部schema IDを混同していない。

### 9.5 文書と生成index

- [x] READMEのrepository名を更新した。
- [x] READMEの基盤URLを新URLへ更新した。
- [x] READMEへ旧名称互換方針を記載した。
- [x] docs/development.mdのtrace chainを更新した。
- [x] TODOの旧名称参照を意図に応じて更新した。
- [x] runtime referenceとsetup例を更新した。
- [x] THIRD_PARTY_NOTICESのartifact名を更新した。
- [x] generated indexを正規手順で再生成した。

```bash
miku-indexgen --refresh-index skills/igapyon-miku-backlog-api/index.json
```

### 9.6 Skillsテスト

```bash
npm ci
npm test
npm run smoke:runtime
npm run build:bundle:zip
```

- [x] runtime source testが新URL、新asset名、新checksumを確認した。
- [x] skill contract testが新旧triggerを確認した。
- [x] runner contract testが既存schemaを確認した。
- [x] release bundle contents testが新正式ZIPを確認した。
- [x] isolated bundle smokeがinstall後のruntimeを実行した。
- [x] 新正式ZIPに必要なSkillファイルとruntimeが含まれる。
- [x] 新Release用bundleは旧名ZIPを複製していない。
- [x] `tests/`、`workplace/`、`.DS_Store`、秘密情報がZIPへ入っていない。
- [x] final diffに無関係な変更がない。

### 9.7 G4記録欄

```text
PR URL: https://github.com/igapyon/miku-backlog-api-skills/pull/29
merge commit: bfbff8f2b2365ec2ca7804a75d74040288b1acfd
commit range: 4e891d0cda269d90aba9be6b13a1caa0663fec59..bfbff8f2b2365ec2ca7804a75d74040288b1acfd
Skills version: 0.7.0
取り込んだ基盤tag: v0.7.0
取り込んだ基盤commit: 2ee5cd26cd412906b771987e1491618d137ab993
runtime SHA-256: 30ab58105b5c06c5b15fc932e1a4fe8b790c0d8cf32f57f0e10f51a76d31d872
検証日時: 2026-08-04
検証結果: npm ci、npm test（29 passed）、npm run smoke:runtime、npm run build:bundle:zip、git diff --check が成功
既知の警告: GitHub管理設定（ruleset、secrets、variables、environments、webhook、Apps、deploy keys）とAboutは別途確認が必要
承認者: 未記録
```

G4承認後もPRをmergeせず、Phase 5のGitHub renameへ進む。

## 10. Phase 5: Skills GitHubリポジトリrename

対象変更:

```text
https://github.com/igapyon/backlog-api-skills
  -> https://github.com/igapyon/miku-backlog-api-skills
```

### 10.1 G5直前条件

- [x] `igapyon/miku-backlog-api-skills`が利用可能である。
- [ ] GitHub管理者権限を確認した。
- [ ] G4が承認済みである。
- [x] default branch、HEAD、PR、Issue、tag、Releaseを記録した。
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

- [x] 新URLが成功する。
- [x] 旧URLが新URLへredirectされる。
- [x] Issue #25が新URLで開ける。
- [x] PR #29がmergeされ、merge commitが保持されている。
- [x] default branch `devel` とHEAD `bfbff8f2b2365ec2ca7804a75d74040288b1acfd` が一致する。
- [x] tagとReleaseが保持されている。
- [x] release workflowが新リポジトリ名のZIPをuploadした。
- [ ] ruleset、secrets、variables、environmentsが保持されている。
- [ ] webhook、Apps、deploy keysの状態を確認した。
- [ ] About、description、website URLを確認した。

主要cloneのremoteを更新する。

```bash
git remote set-url origin git@github.com:igapyon/miku-backlog-api-skills.git
git remote -v
git ls-remote origin HEAD
```

- [x] release workflowを新リポジトリ名の状態で実行し、正式ZIPをuploadした。
- [ ] rename-ready PRのcheckが成功した。
- [x] 旧名`backlog-api-skills`のリポジトリを新規作成していない。

### 10.4 Skills PR mergeとRelease

G5のrename後確認と、PR check成功を人間がレビューしてから実行する。

- [x] rename-ready PRをmergeした。
- [x] merge commitを記録した。
- [x] 正式versionのtagをGitHub Release画面で作成または選択した。
- [x] Releaseを公開した。
- [x] 新正式ZIPを確認した。
- [x] 新Releaseに旧名ZIPを複製していない。
- [x] ZIPのchecksumを確認した。
- [x] 新URLからZIPをdownloadできる。
- [x] 旧Release URLのredirectを確認した。

記録:

```text
rename日時: 2026-08-04（GitHub公開状態で確認）
実施者: 未記録（GitHub管理操作）
旧URL: https://github.com/igapyon/backlog-api-skills
新URL: https://github.com/igapyon/miku-backlog-api-skills
merge commit: bfbff8f2b2365ec2ca7804a75d74040288b1acfd（PR #29）
tag: v0.7.0
Release URL: https://github.com/igapyon/miku-backlog-api-skills/releases/tag/v0.7.0
ZIP一覧: igapyon-miku-backlog-api-skills-0.7.0.zip（215211 bytes、uploaded）
checksum確認結果: SHA-256 e1bf0156b47a54fb5afe40ed7e09d8e2fed3f0a70685e5be4c137718e9c02ee6（一致）
```

## 11. Phase 6: 連携・外部参照の切替

- [x] 基盤READMEのSkillsリンクを正式な新URLへ変更した（PR #23、merge commit `c0b0ee9047386973bc8ebb1c7947267e99f5d369`）。
- [x] Skills READMEの基盤リンクが正式な新URLを指す。
- [x] docs、TODO、traceabilityのcanonical URLを更新した。
- [x] Skills GitHub Aboutのdescriptionを更新し、website URLは未設定であることを確認した。
- [ ] 外部README、インストール手順、clone URLの更新依頼を完了した。
- [ ] Action/reusable workflow利用者がいる場合、全参照を更新した。
- [x] 主要なローカルcloneのremoteを更新した。
- [x] CIやローカルscriptがredirectへ依存していない。
- [x] 旧GitHubリポジトリ名を再利用していない。

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
- [ ] 新Releaseに旧名assetを複製していない。
- [ ] checksumが一致する。
- [ ] CI、typecheck、trace、test、smokeが成功している。

### 12.2 Skills

- [x] canonical GitHub URLが`igapyon/miku-backlog-api-skills`である。
- [x] package名が`miku-backlog-api-skills`である。
- [x] installed Skill名が`igapyon-miku-backlog-api`である。
- [x] 新旧triggerが同じSkillをactivateする。
- [x] runtime source recordが新基盤Releaseを指す。
- [x] 新正式ZIPが公開されている。
- [x] 新Releaseに旧名ZIPを複製していない。
- [x] CI、test、runtime smoke、bundle、isolated smokeが成功している。

### 12.3 GitHubと外部連携

- [x] 旧Web URLがredirectされる。
- [x] Issue #21と#25が新URLで開ける。
- [x] 既存PR、tag、Releaseが保持されている。
- [ ] Actions、ruleset、secrets、webhookが正常である。
- [x] 主要cloneのremoteが新URLを指す。
- [x] 旧名称リポジトリが再作成されていない。
- [ ] 外部Action/reusable workflow参照が残っていない。

### 12.4 完了記録

Issueへのcomment、本文更新、closeはそれぞれ別のmiku-scm承認workflowで行う。
この文書の完了だけではGitHub Issueのmutationを承認しない。

- [x] Issue #21へ採用理由、互換方針、実施結果を記録した。
- [x] Issue #25へSkills側の名称対応、runtime連携、実施結果を記録した。
- [x] 必要な後続Issueはないと判断した。
- [x] Issue #21の完了条件を確認した。
- [x] Issue #25の完了条件を確認した。
- [x] 人間の承認後に各Issueをcloseした。

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

- runner/schema IDのversion付きrename
- handoff保存先と既存handoff migration
- `BACKLOG_API_*`環境変数aliasと廃止計画
- 旧CLI aliasの廃止
- 旧Release asset名と旧ZIP名の廃止

これらをWave 1へ追加しない。実施する場合は、互換期間、migration、
deprecation warning、テスト、rollbackを別途定義する。

## 16. 実行ログ

各作業時に追記する。秘密値、API key、credential、tenant dataは記録しない。

| 日時 | Phase / Gate | リポジトリ | branch / commit | 実施内容 | 結果 | 実施者 |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-08-04 | Phase 4 | backlog-api-skills | `devel-tiga0804uec` / 未commit | `miku-backlog-api v0.7.0` runtime取込み、Skill・package・bundle・文書の名称移行 | ローカル検証成功。Skills GitHub rename、PR merge、tag、Releaseは未実施 | Agent |
| 2026-08-04 | Phase 5 / 10.4確認 | miku-backlog-api-skills | `devel` / `bfbff8f2b2365ec2ca7804a75d74040288b1acfd` | rename後のURL、Issue #25、PR #29、tag、Release、ZIPを読み取り確認 | 旧URLと旧Release URLはredirect。`v0.7.0` Releaseの正式ZIPをdownloadし、SHA-256一致を確認 | Agent |
| 2026-08-04 | Phase 6 / 7確認 | miku-backlog-api-skills | `devel` / `bfbff8f2b2365ec2ca7804a75d74040288b1acfd` | README、docs、traceability、CI設定、local remoteのcanonical URLを確認 | 移行計画内の履歴用URL以外に旧canonical URLは残存せず、local remoteも新URLを指す | Agent |
| 2026-08-04 | v0.7.1 Release確認 | miku-backlog-api-skills | `devel` / `8ce3d5befb9cc5fe9bb03a2bd6a8f9549ac16e4b` | Release、ZIP、checksum、CIを確認 | `v0.7.1` Release公開済み。正式ZIPのSHA-256 `bdcb9cd0212bebfb683051dfe58cc9c6c4b299557597b37d8462dfc4eb58247c` が一致し、CIとrelease workflowが成功 | Agent |
| 2026-08-04 | Phase 6 | miku-backlog-api | `devel` / `c0b0ee9047386973bc8ebb1c7947267e99f5d369` | 基盤READMEのSkillsリポジトリリンクをcanonical URLへ更新（PR #23） | PR #23はmerge済み | 人間・Agent |
| 2026-08-04 | v0.7.3 Release確認 | miku-backlog-api-skills | `devel` / `83b48b84e180265e6f730d4accea453153384a68` | PR #32のmerge、`v0.7.3` Release、正式ZIP、checksumを確認 | `igapyon-miku-backlog-api-skills-0.7.3.zip`（215212 bytes）のSHA-256 `55758072d6c7f290f4eb2b74d8742266903a3ba5f0b3b8846a10711b9591e1cd` が一致 | Agent |
| 2026-08-04 | Phase 7 / G6完了記録 | miku-backlog-api / miku-backlog-api-skills | GitHub Issue #21 / #25 | 既存コメントと完了条件を確認し、人間承認済みhandoffを適用 | Issue #21・#25を `completed` でclose | 人間・Agent |

## 17. 最終サマリー記入欄

```text
基盤旧URL: https://github.com/igapyon/backlog-api
基盤新URL: https://github.com/igapyon/miku-backlog-api
基盤最終version/tag/commit: 0.7.0 / v0.7.0 / 2ee5cd26cd412906b771987e1491618d137ab993
基盤Release URL: https://github.com/igapyon/miku-backlog-api/releases/tag/v0.7.0

Skills旧URL: https://github.com/igapyon/backlog-api-skills
Skills新URL: https://github.com/igapyon/miku-backlog-api-skills
Skills最終version/tag/commit: 0.7.3 / v0.7.3 / 83b48b84e180265e6f730d4accea453153384a68
Skills Release URL: https://github.com/igapyon/miku-backlog-api-skills/releases/tag/v0.7.3

runtime source version/tag/commit/SHA-256: miku-backlog-api 0.7.0 / v0.7.0 / 2ee5cd26cd412906b771987e1491618d137ab993 / 30ab58105b5c06c5b15fc932e1a4fe8b790c0d8cf32f57f0e10f51a76d31d872
旧互換CLIの期限:
旧互換assetの期限:
旧互換triggerの期限:

未解決事項: privateなGitHub管理設定（ruleset、secrets、webhook等）は別途管理者確認が必要。website URLは未設定。
後続Issue: なし
最終承認者: 人間（Issue close handoff）
完了日時: 2026-08-04
```
