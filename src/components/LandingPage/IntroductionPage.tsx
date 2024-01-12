import { useState } from "react";

import { Modal, useModal } from "@tiller-ds/alert";
import { Button, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import useSchemaModalStore from "../../stores/schemaModalStore";

export default function IntroductionPage() {
  const [introductionOpened, setIntroductionOpened] = useState<boolean>(true);

  const modal = useModal();
  const setLandingPageModalOpened = useSchemaModalStore(
    (store) => store.setOpened,
  );

  return (
    <Modal
      {...modal}
      isOpen={introductionOpened}
      state={undefined}
      canDismiss={false}
      tokens={{
        Container: {
          Content: {
            container: {
              master:
                "relative overflow-hidden overflow-y-visible scrollbar transform transition-all sm:max-w-4xl sm:w-full max-h-screen focus:outline-none",
            },
          },
        },
      }}
    >
      <Modal.Content
        title={
          <Typography variant="h1" className="ml-8 mb-8">
            Welcome!
          </Typography>
        }
      >
        <div className="flex flex-col space-y-4 px-10 pt-6 pb-20">
          <img
            src="/logo.png"
            alt="APIExplore logo"
            className="w-full h-full -mr-20"
          />
          <Typography variant="subtitle" className="text-lg">
            <b>Application Programming Interfaces, or APIs,</b> are widely used
            in software development. Knowing how an API behaves is important
            whether you&apos;re a developer building one or a user incorporating
            it into an application. It becomes difficult to provide the
            consumers with the necessary information when interactive software
            is lacking to investigate an API&apos;s behavior. The goal of the
            APIExplore project is to build demonstrator software that allows
            developers to easily interact and understand the behavior of APIs.
          </Typography>
          <Typography variant="subtitle" className="text-lg">
            The result of the project is a web-based application that contains
            the implementation of all the specified features. The major
            functionalities of the tool are listed briefly:
            <ul className="list-disc px-4 pt-2">
              <li className="py-1">
                <b>Importing API Schema three ways</b>: Fetching from a URL,
                uploading a JSON file, and fetching previously uploaded schema
                from a database.
              </li>
              <li className="py-1">
                <b>Constructing API call sequences</b>: Users can add call
                sequences by filtering using HTTP method, arrange their call
                order. They can also upload call sequences as a file.
              </li>
              <li className="py-1">
                <b>Timeline View</b>: Users can view the timing of the API calls
                in an interactive timeline visualizer window.
              </li>
              <li className="py-1">
                <b>Dependency/Relationship Visualization Graph</b>: The
                connection between different API calls is displayed in a
                dependency graph interface.
              </li>
              <li className="py-1">
                <b>Control the state of the System Under Test (SUT)</b>: Users
                can start, stop and restart the SUT.
              </li>
              <li className="py-1">
                <b>Performance Metrics Analysis</b>: The performance metrics of
                the API calls are provided for the user.
              </li>
              <li className="py-1">
                <b>Logging and Sequence configuration</b>: Important logs are
                provided in a logging window and API call sequences can be
                configured to be performed in a call-by-call manner.
              </li>
            </ul>
          </Typography>
        </div>
        <Button
          id="close-introduction-page"
          className="absolute bottom-8 right-8"
          onClick={() => {
            setIntroductionOpened(!introductionOpened);
            setLandingPageModalOpened(true);
          }}
          trailingIcon={<Icon type="arrow-right" />}
        >
          Continue
        </Button>
      </Modal.Content>
    </Modal>
  );
}
