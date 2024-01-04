import axios from "axios";
import { create } from "zustand";

import { agentDomain } from "../constants/apiConstants";

type AgentStore = {
  agentId: string;
  agentPid: string;
  agentLoading: boolean;
  startAgent: any;
  restoreAgent: any;
};

const useAgentStore = create<AgentStore>((set) => ({
  agentId: "",
  agentPid: "",
  agentLoading: false,
  startAgent: async (
    newAgentId: string,
    currentAgentId: string,
    currentAgentPid: string,
  ) => {
    set(() => ({
      agentLoading: true,
    }));

    try {
      if (currentAgentId && currentAgentPid && newAgentId !== currentAgentId) {
        await axios.post(`${agentDomain}/stop-agent/${currentAgentId}`, {
          id: currentAgentId,
          pid: currentAgentId,
        });
      }
      if (
        (!currentAgentId && !currentAgentPid) ||
        (currentAgentId && currentAgentPid && newAgentId !== currentAgentId)
      ) {
        const agentPidResponse = await axios.get(
          `${agentDomain}/api/start-api/${newAgentId}`,
        );
        const agentPid = agentPidResponse.data.pid;

        set(() => ({
          agentId: newAgentId,
          agentPid: agentPid,
        }));
        console.info(`Agent ID: ${newAgentId}, Agent PID: ${agentPid}`);
      }
    } catch (error) {
      console.error("Error fetching agent data", error);
    } finally {
      set(() => ({
        agentLoading: false,
      }));
    }
  },
  restoreAgent: async (agentId, agentPid) => {
    set(() => ({
      agentLoading: true,
    }));

    const agentData = await axios.post(`${agentDomain}/api/restart-api`, {
      id: agentId,
      pid: agentPid,
    });

    console.info(agentData.data);

    set(() => ({
      agentPid: agentData.data.PID,
    }));

    set(() => ({
      agentLoading: false,
    }));
  },
}));

export default useAgentStore;
