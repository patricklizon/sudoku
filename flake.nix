{
  description = "Node.js project with Playwright";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    nixd.url = "github:nix-community/nixd";
  };

  outputs = { self, nixpkgs, flake-utils, nixd }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        nodejs = pkgs.nodejs_22;
        playWrightBrowserDeps = with pkgs; [
          xvfb-run
          libX11
          libXcomposite
          libXcursor
          libXdamage
          libXext
          libXi
          libXtst
          libXrandr
          libXScrnSaver
          libxshmfence
          libGLU
          mesa
          nss
          nspr
          fontconfig
          freetype
        ];

      in {
        formatter = pkgs.nixfmt;

        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [ nodejs playwright-test ] ++ playWrightBrowserDeps;

          shellHook = ''
            export HOME=$(mktemp -d)
            export npm_config_cache=$HOME/.npm
            export PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright-driver.browsers}
            export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

            echo "Node.js $(node --version)"
            echo "npm $(npm --version)"
          '';
        };
      });
}
