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
        nodejs = pkgs.nodejs_22;

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
            # Get the full version string directly from the Nix package
            nix_node_full_version="${nodejs.version}"
            # Use shell parameter expansion to get the major version (e.g., "22.17.1" -> "22")
            nix_node_major_version=''${nix_node_full_version%%.*}

            file_node_version=""
            if [ -f "${nodeVersionFileName}" ]; then
                file_node_version=$(cat "${nodeVersionFileName}" | xargs)
            fi

            if [ "''$nix_node_major_version" != "''$file_node_version" ]; then
                echo "Updating .node-version: ' ''$file_node_version ' -> ' ''$nix_node_major_version '"
                printf "%s" "''$nix_node_major_version" > "${nodeVersionFileName}"
            else
                echo ".node-version is already up to date."
            fi
            echo "Using Node.js version: $(${nodejs}/bin/node --version | xargs)"
          '';
        };
      });
}
