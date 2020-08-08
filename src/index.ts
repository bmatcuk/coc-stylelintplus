import {
  ExtensionContext,
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
  services,
  workspace,
} from "coc.nvim"

interface Config {
  filetypes?: string[]
  cssInJs?: boolean
}

const DEFAULT_FILETYPES = [
  "css",
  "less",
  "postcss",
  "scss",
  "sugarss",
  "vue",
  "wxss",
]

export async function activate(context: ExtensionContext): Promise<void> {
  const config = workspace.getConfiguration().get<Config>("stylelintplus", {})
  let documentSelector = config.filetypes || DEFAULT_FILETYPES
  if (config.cssInJs) {
    documentSelector = [
      ...documentSelector,
      "javascript",
      "javascriptreact",
      "typescript",
      "typescriptreact",
    ]
  }

  const serverOptions: ServerOptions = {
    args: ["--node-ipc"],
    module: require.resolve("stylelint-lsp"),
    options: {
      cwd: workspace.root,
    },
    transport: TransportKind.ipc,
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector,
    diagnosticCollectionName: "stylelintplus",
    outputChannelName: "stylelintplus",
    synchronize: {
      configurationSection: "stylelintplus",
      fileEvents: [
        workspace.createFileSystemWatcher("**/.stylelintignore"),
        workspace.createFileSystemWatcher("**/stylelint.config.js"),
        workspace.createFileSystemWatcher(
          "**/.stylelintrc{,.json,.yaml,.yml,.js}"
        ),
        workspace.createFileSystemWatcher("**/package.json"),
      ],
    },
  }

  const client = new LanguageClient(
    "stylelintplus",
    "stylelint language server",
    serverOptions,
    clientOptions
  )

  const { subscriptions } = context
  subscriptions.push(services.registLanguageClient(client))
}
