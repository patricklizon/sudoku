{
  description = "Node.js project";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        nodejs = pkgs.nodejs_22;
      in {
        formatter = pkgs.nixfmt;

        devShells.default = pkgs.mkShell {
          buildInputs = [ nodejs ];

          shellHook = ''
            export HOME=$(mktemp -d)
            export npm_config_cache=$HOME/.npm

            echo "Node.js $(node --version)"
            echo "npm $(npm --version)"
          '';
        };
      });
}
