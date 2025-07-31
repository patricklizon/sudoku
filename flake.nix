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
        nodeVersionFileName = ".node-version";
        bunjs = pkgs.bun;
        nixd = pkgs.nixd;
        nodejs = pkgs.nodejs-22_x;

      in {
        formatter = pkgs.nixfmt;

        devShells.default = pkgs.mkShell {
          buildInputs = [ bunjs nixd nodejs ];

          shellHook = ''
            # --- Bun Version Management ---
            nix_bun_version=$(${bunjs}/bin/bun --version | xargs)
            file_bun_version=""
            if [ -f "${bunVersionFileName}" ]; then
              file_bun_version=$(cat "${bunVersionFileName}" | xargs)
            fi
            if [ "''$nix_bun_version" != "''$file_bun_version" ]; then
              echo "Updating .bun-version: ' ''$file_bun_version ' -> ' ''$nix_bun_version '"
              printf "%s" "''$nix_bun_version" > "${bunVersionFileName}"
            fi
            echo "Using Bun version: ''$nix_bun_version"

            # --- Node.js Version Management ---
            nix_node_full_version=$(${nodejs}/bin/node --version | xargs)
            nix_node_major_version=$(echo "''$nix_node_full_version" | cut -d'v' -f2 | cut -d'.' -f1)
            file_node_version=""
            if [ -f "${nodeVersionFileName}" ]; then
                file_node_version=$(cat "${nodeVersionFileName}" | xargs)
            fi
            if [ "''$nix_node_major_version" != "''$file_node_version" ]; then
                echo "Updating .node-version: ' ''$file_node_version ' -> ' ''$nix_node_major_version '"
                printf "%s" "''$nix_node_major_version" > "${nodeVersionFileName}"
            fi
            echo "Using Node.js version: ''$nix_node_full_version (LTS)"
          '';
        };
      });
}
