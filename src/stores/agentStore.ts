import axios from "axios";
import { create, SetState } from "zustand";

import { agentDomain } from "../constants/apiConstants";

type AgentStore = {
  agentId: string | null;
  agentPid: string | null;
  agentLoading: boolean;
  startedApi: string | null;
  setStartedApi: (api: string | null) => void;
  startAgent: (
    newAgentId: string,
    currentAgentId: string,
    currentAgentPid: string,
    javaPath?: string,
  ) => Promise<void>;
  restoreAgent: (agentId: string, agentPid: string) => Promise<void>;
  stopAgent: () => Promise<void>;
  javaPath: string;
  setJavaPath: (api: string) => void;
};

const useAgentStore = create<AgentStore>((set: SetState<AgentStore>, get) => ({
  agentId: null,
  agentPid: null,
  agentLoading: false,
  startedApi: null,
  setStartedApi: (api: string | null) => set({ startedApi: api }),
  javaPath: "",
  setJavaPath: (path: string) => set({ javaPath: path }),
  startAgent: async (
    newAgentId: string,
    currentAgentId: string,
    currentAgentPid: string,
  ) => {
    set({ agentLoading: true });

    try {
      if (currentAgentId && currentAgentPid && newAgentId !== currentAgentId) {
        await axios.post(`${agentDomain}/api/stop-api`, {
          id: currentAgentId,
          pid: currentAgentPid,
        });
      }

      let agentPidResponse;
      if (get().javaPath.length > 0) {
        agentPidResponse = await axios.get(
          `${agentDomain}/api/start-api/${newAgentId}?javaPath=${encodeURIComponent(
            get().javaPath,
          )}`,
        );
      } else {
        agentPidResponse = await axios.get(
          `${agentDomain}/api/start-api/${newAgentId}`,
        );
      }

      const agentPid = agentPidResponse.data.PID;

      set({
        agentId: newAgentId,
        agentPid: agentPid,
        agentLoading: false,
        javaPath: get().javaPath,
      });

      console.info(`Agent ID: ${newAgentId}, Agent PID: ${agentPid}`);
    } catch (error) {
      console.error("Error starting agent:", error);
      set({ agentLoading: false });
      throw error;
    }
  },
  restoreAgent: async (agentId: string, agentPid: string) => {
    set({ agentLoading: true });

    try {
      const agentData = await axios.post(`${agentDomain}/api/restart-api`, {
        id: agentId,
        pid: agentPid,
        javaPath: get().javaPath,
      });

      set({ agentPid: agentData.data.PID });
      console.info(agentData.data);
    } catch (error) {
      console.error("Error restoring agent:", error);
      throw error;
    } finally {
      set({ agentLoading: false });
    }
  },
  stopAgent: async () => {
    try {
      if (get().agentId && get().agentPid) {
        await axios.post(`${agentDomain}/api/stop-api`, {
          id: get().agentId,
          pid: get().agentPid,
        });
      }
      set({ startedApi: null });
      set({ agentId: null });
      set({ agentPid: null });
    } catch (error) {
      console.error("Error stopping agent:", error);
      throw error;
    }
  },
}));

export default useAgentStore;
