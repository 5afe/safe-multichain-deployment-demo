# Multichain Safe Deployment

This example application shows how to deploy Safe smart accounts in multiple chains with the same configuration and address.

Please read the [Safe React Hooks](https://docs.safe.global/sdk/react-hooks) in the Safe documentation to see how to integrate Safe via React Hooks.

## Prerequisites

You will need some basic experience with [React](https://react.dev/learn), [Next.js](https://nextjs.org/docs). Before progressing with the tutorial, please make sure you have:

- Downloaded and installed [Node.js](https://nodejs.org/en/download/package-manager) and [pnpm](https://pnpm.io/installation).

## Getting Started

To install this example application, run the following commands:

```bash
git clone https://github.com/5afe/safe-multichain-deployment-demo.git
cd safe-multichain-deployment-demo
pnpm install
```

Create a file named `.env` at the root of your project, and add your Pimlico API key to it:

echo "NEXT_PUBLIC_PIMLICO_API_KEY='your_pimlico_api_key_goes_here'" > .env

Run the local development server with the following command:

```bash
pnpm dev
```

Go to `http://localhost:3000` in your browser to see the application.

## Help

Please post any questions on [Stack Exchange](https://ethereum.stackexchange.com/questions/tagged/safe-core) with the `safe-core` tag.

## License

MIT, see [LICENSE](LICENSE).
