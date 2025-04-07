{
  description = "Node.js project with Playwright";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        nodejs = pkgs.nodejs_22;

        browserDeps = with pkgs; [
          xvfb-run
          xorg.libX11
          xorg.libXcomposite
          xorg.libXcursor
          xorg.libXdamage
          xorg.libXext
          xorg.libXi
          xorg.libXtst
          xorg.libXrandr
          xorg.libXScrnSaver
          xorg.libxshmfence
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
          buildInputs = with pkgs; [
            nodejs
            playwright-test
          ] ++ browserDeps;

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
