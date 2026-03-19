# nox-subgraph

A subgraph indexing [`nox-protocol-contracts`](https://github.com/iExec-Nox/nox-protocol-contracts)

## Build

```sh
# install deps
npm ci

# generate code from the ABIs
npm run codegen

# build
npm run build
```

## Test

```sh
npm run test
```

## Deploy

### Self-hosted node

Prerequisites:

- IPFS node with access to admin API
- Graph node connected to network `arbitrum-sepolia` with access to admin API

env:

- `NETWORK_NAME`: target network name (e.g. `arbitrum-sepolia`)
- `GRAPHNODE_URL`: Graph node admin API url
- `IPFS_URL`: IPFS admin API url
- `VERSION_LABEL` (optional): deployment version label (default `dev`)

```sh
# set deployment urls
export NETWORK_NAME="arbitrum-sepolia"
export GRAPHNODE_URL="http://localhost:8020"
export IPFS_URL="http://localhost:5001"

# generate code from the ABIs
npm run codegen

# build
npm run build

# deploy
npm run deploy
```

### Subgraph Studio

env:

- `SUBGRAPH_SLUG`: subgraph slug in Subgraph Studio
- `SUBGRAPH_DEPLOY_KEY`: deploy key from Subgraph Studio
- `SUBGRAPH_NETWORK_NAME`: target network name
- `VERSION_LABEL`: deployment version label

```sh
export SUBGRAPH_SLUG="nox-protocol"
export SUBGRAPH_DEPLOY_KEY="your-deploy-key"
export SUBGRAPH_NETWORK_NAME="arbitrum-sepolia"
export VERSION_LABEL="v0.0.1"

npm run deploy-studio
```

### Local development

env:

- `SUBGRAPH_NETWORK_NAME`: target network name
- `VERSION_LABEL`: deployment version label (default `dev`)

```sh
export SUBGRAPH_NETWORK_NAME="arbitrum-sepolia"

# create a local subgraph
npm run create-local

# deploy to local node
npm run deploy-local

# remove local subgraph
npm run remove-local
```

Once deployed, the subgraph can be queried via the GraphiQL interface.
