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
            # Get the version from the bun package and trim whitespace
            nix_bun_version=$(${bunjs}/bin/bun --version | xargs)
            file_bun_version=""

            # If the file exists, read it and trim whitespace
            if [ -f "${bunVersionFileName}" ]; then
              file_bun_version=$(cat "${bunVersionFileName}" | xargs)
            fi

            # Compare the clean versions and update if they differ.
            # ''$ escapes the $ for Nix, so the shell sees $file_bun_version.
            if [ "''$nix_bun_version" != "''$file_bun_version" ]; then
              echo "Updating .bun-version: ' ''$file_bun_version ' -> ' ''$nix_bun_version '"
              printf "%s" "''$nix_bun_version" > "${bunVersionFileName}"
            fi

            echo "Using Bun version: ''$nix_bun_version"
          '';
        };
      });
}
