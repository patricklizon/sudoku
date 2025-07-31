{
  description = "Bun.js project";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        bunVersionFileName = ".bun-version";
        bunjs = pkgs.bun;
        nixd = pkgs.nixd;
      in {
        formatter = pkgs.nixfmt;

        devShells.default = pkgs.mkShell {
          buildInputs = [ bunjs nixd ];

          shellHook = ''
            export HOME=$(mktemp -d)

            local_bun_version=$(bun --version)

            if [ ! -f ${bunVersionFileName} ] || ! grep -q "^$bun_major_version" ${bunVersionFileName}; then
              echo "$local_bun_version" > ${bunVersionFileName}
            fi

            echo "Bun $(bun --version)"
          '';
        };
      });
}
