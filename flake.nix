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
        nodeVersionFileName = ".nvmrc";
        nodeMajor = "22";
        nodejs = pkgs."nodejs_${nodeMajor}";
      in {
        formatter = pkgs.nixfmt;

        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [ nodejs ];

          shellHook = ''
            export HOME=$(mktemp -d)
            export npm_config_cache=$HOME/.npm

            # Generate .nvmrc file if it doesn't exist or major version doesn't match
            if [ ! -f ${nodeVersionFileName} ] || ! grep -q "^${nodeMajor}\|^v${nodeMajor}" ${nodeVersionFileName}; then
              echo "${nodeMajor}" > ${nodeVersionFileName}
              echo "Generated .nvmrc with Node.js version ${nodeMajor}"
            fi

            echo "Node.js $(node --version)"
            echo "npm $(npm --version)"
          '';
        };
      });
}
