import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { Snippet } from "@heroui/snippet";

import { urlExplorer } from "@/lib/utils";

export default function ModalTransactionCustom({
  isOpen,
  onClose,
  status,
  data,
  name,
  errorMessage,
}: {
  isOpen: boolean;
  onClose: () => void;
  status: string;
  data: string;
  name: string;
  errorMessage?: string;
}) {
  return (
    <Modal className="pb-5" isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>Transaction {status}</ModalHeader>
        <ModalBody>
          {errorMessage ? (
            <>
              <span>
                Your transaction getting error: {errorMessage && errorMessage}
              </span>
            </>
          ) : (
            <>
              <span>
                Your {name} is {status}, you can see transaction hash below:
              </span>
              <span className="text-center">Transaction Hash:</span>
              <Snippet
                hideSymbol
                className="w-auto"
                color="success"
                variant="flat"
              >
                {data && data.length > 20
                  ? `${data.substring(0, 30)}...`
                  : data}
              </Snippet>
              <a
                className="underline underline-offset-1 cursor-pointer text-sm text-center"
                href={urlExplorer({
                  txHash: data && data,
                  type: "none",
                })}
                rel="noopener noreferrer"
                target="_blank"
              >
                view on explorer
              </a>
            </>
          )}
          <Button className="mt-4" onPress={onClose}>
            Close
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
