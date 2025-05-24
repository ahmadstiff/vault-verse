import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import DefaultLayout from "@/layouts/default";
import { siteConfig } from "@/config/site";
import { GithubIcon, TwitterIcon } from "@/components/icons";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-12 md:py-24">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            VaultVerse
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-default-600">
            A programmable vault for your Sui assets. Create, customize, and
            share your vaults with friends.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="font-medium"
              color="primary"
              size="lg"
              onClick={() => navigate("/vaults")}
            >
              Create Vault
            </Button>
            <Button
              className="font-medium"
              color="secondary"
              size="lg"
              variant="bordered"
              onClick={() => navigate("/vaults")}
            >
              Manage Vaults
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <p className="text-default-600 max-w-2xl mx-auto">
            Discover the powerful features that make VaultVerse the ultimate
            solution for managing your Sui assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          <Card className="border-none" shadow="sm">
            <CardHeader className="flex gap-3 pb-0">
              <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">
                  Vault Creation & Customization
                </h3>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-default-600">
                Create personalized vaults for your digital assets and customize
                them to your preferences with advanced settings.
              </p>
            </CardBody>
          </Card>

          <Card className="border-none" shadow="sm">
            <CardHeader className="flex gap-3 pb-0">
              <div className="p-2 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg">
                <svg
                  className="h-6 w-6 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                  <path
                    d="M8 12h8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                  <path
                    d="M12 16V8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">Asset Management</h3>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-default-600">
                Securely store and manage your Sui blockchain assets in one
                place with intuitive controls and real-time updates.
              </p>
            </CardBody>
          </Card>

          <Card className="border-none" shadow="sm">
            <CardHeader className="flex gap-3 pb-0">
              <div className="p-2 bg-success-50 dark:bg-success-900/20 rounded-lg">
                <svg
                  className="h-6 w-6 text-success"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                  <path
                    d="M8 10a2 2 0 100-4 2 2 0 000 4z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">NFT Features</h3>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-default-600">
                Special support for NFT storage, display, and management with
                beautiful galleries and metadata viewing.
              </p>
            </CardBody>
          </Card>

          <Card className="border-none" shadow="sm">
            <CardHeader className="flex gap-3 pb-0">
              <div className="p-2 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
                <svg
                  className="h-6 w-6 text-warning"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">Multi-wallet Support</h3>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-default-600">
                Connect and manage assets from multiple wallet providers with
                seamless integration and switching.
              </p>
            </CardBody>
          </Card>

          <Card className="border-none" shadow="sm">
            <CardHeader className="flex gap-3 pb-0">
              <div className="p-2 bg-danger-50 dark:bg-danger-900/20 rounded-lg">
                <svg
                  className="h-6 w-6 text-danger"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">Transaction Handling</h3>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-default-600">
                Streamlined transaction experience for deposits, withdrawals,
                and transfers with detailed history tracking.
              </p>
            </CardBody>
          </Card>

          <Card className="border-none" shadow="sm">
            <CardHeader className="flex gap-3 pb-0">
              <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">Security First</h3>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-default-600">
                Enhanced security measures to protect your digital assets with
                optional multi-factor authentication.
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 bg-gradient-to-r from-primary-100/50 to-secondary-100/50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl my-12">
        <div className="text-center px-4">
          <h2 className="text-3xl font-bold mb-4">
            Ready to secure your assets?
          </h2>
          <p className="text-default-600 max-w-xl mx-auto mb-8">
            Start using VaultVerse today and experience the next generation of
            asset management on the Sui blockchain.
          </p>
          <Button
            className="font-medium"
            color="primary"
            size="lg"
            onClick={() => navigate("/vaults")}
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Connect With Us</h2>
          <p className="text-default-600">
            Join our community and stay updated
          </p>
        </div>
        <div className="flex justify-center gap-6">
          <Link isExternal href={siteConfig.links.github}>
            <Button isIconOnly aria-label="GitHub" variant="light">
              <GithubIcon className="text-default-500" />
            </Button>
          </Link>
          <Link isExternal href={siteConfig.links.twitter}>
            <Button isIconOnly aria-label="Twitter" variant="light">
              <TwitterIcon className="text-default-500" />
            </Button>
          </Link>
        </div>
      </section>
    </DefaultLayout>
  );
}
