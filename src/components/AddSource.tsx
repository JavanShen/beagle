import {
  Form,
  Input,
  Button,
  Tooltip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
  Tabs,
} from "@heroui/react";
import { updateWebdavClient, getWebdavClient } from "@/utils/request";
import useStore from "@/store";
import { useRequest } from "ahooks";
import TipIcon from "@/assets/help.svg?react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";

const AddSource = NiceModal.create(() => {
  const modal = useModal();
  const source = useStore((state) => state.source);
  const setSource = useStore((state) => state.setSource);
  const setAccount = useStore((state) => state.setAccount);

  const { loading: isLoginLoading, run: onLogin } = useRequest(
    async (source, username, password) => {
      // 允许无账号
      if (username && password) {
        updateWebdavClient(source, {
          username,
          password,
        });

        return {
          username,
          password,
          isValid: await getWebdavClient().exists("/"),
        };
      } else {
        modal.hide();
      }
    },
    {
      manual: true,
      onSuccess: (res) => {
        if (res?.isValid) {
          setAccount(res.username, res.password);
          modal.hide();
        }
      },
    },
  );

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const sourceURL = formData.get("source") as string;

    setSource(sourceURL);
    onLogin(sourceURL, username, password);
  };

  return (
    <Modal isOpen={modal.visible} onClose={() => modal.hide()}>
      <ModalContent>
        <ModalHeader>Add Source</ModalHeader>
        <ModalBody>
          <div className="w-full px-12 pb-6 pt-4">
            <Tabs aria-label="source type" placement="top" fullWidth>
              <Tab key="webdav" title="WebDAV">
                <Form
                  className="flex flex-col items-center gap-y-5 mt-5"
                  onSubmit={onSubmit}
                >
                  <Input
                    type="url"
                    name="source"
                    placeholder="Source URL"
                    defaultValue={source}
                    endContent={
                      <Tooltip content="URL pointing to the music folder in WebDAV, like https://example.com/webdav/music">
                        <TipIcon
                          className="opacity-60 cursor-default"
                          height={24}
                          width={24}
                        />
                      </Tooltip>
                    }
                  />
                  <Input type="text" name="username" placeholder="Username" />
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                  />
                  <Button
                    className="text-white"
                    type="submit"
                    color="primary"
                    isLoading={isLoginLoading}
                  >
                    Connect
                  </Button>
                </Form>
              </Tab>
              <Tab key="ftp" title="FTP" isDisabled></Tab>
              <Tab key="smb" title="SMB" isDisabled></Tab>
            </Tabs>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

export default AddSource;
