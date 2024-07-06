import { ZegoExpressEngine } from "zego-express-engine-webrtc";
import EventEmitter from "events";

class ZegoCloudService extends EventEmitter {
  private zg: ZegoExpressEngine | null = null;
  private localStream: MediaStream | null = null;
  private remoteStreams: Map<string, MediaStream> = new Map();

  constructor() {
    super();
    if (typeof window !== "undefined") {
      this.initializeZegoEngine();
    }
  }

  private initializeZegoEngine() {
    this.zg = new ZegoExpressEngine(
      1637361700,
      "d5d8c6546e54b3d1e49819a584920643"
    );
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.zg) {
      throw new Error("Zego Engine not initialized");
    }

    this.zg.on(
      "roomStreamUpdate",
      async (roomID, updateType, streamList, extendedData) => {
        if (updateType === "ADD") {
          for (const stream of streamList) {
            try {
              const remoteStream = await this.zg!.startPlayingStream(
                stream.streamID
              );
              this.remoteStreams.set(stream.streamID, remoteStream);
              this.emit("remoteStreamAdded", stream.streamID, remoteStream);
            } catch (error) {
              console.error("Error adding remote stream:", error);
            }
          }
        } else if (updateType === "DELETE") {
          for (const stream of streamList) {
            this.zg!.stopPlayingStream(stream.streamID);
            this.remoteStreams.delete(stream.streamID);
            this.emit("remoteStreamRemoved", stream.streamID);
          }
        }
      }
    );

    this.zg.on("roomUserUpdate", (roomID, updateType, userList) => {
      if (updateType === "ADD") {
        for (const user of userList) {
          this.emit("userJoined", user);
        }
      } else if (updateType === "DELETE") {
        for (const user of userList) {
          this.emit("userLeft", user);
        }
      }
    });

    this.zg.on("roomStateUpdate", (roomID, state, errorCode, extendedData) => {
      this.emit("roomStateUpdate", roomID, state, errorCode, extendedData);
    });
  }

  async loginRoom(
    roomID: string,
    userID: string,
    userName: string,
    token: string
  ) {
    if (!this.zg) {
      throw new Error("Zego Engine not initialized");
    }

    try {
      await this.zg.loginRoom(roomID, token, { userID, userName });
      console.log("Login room success");
    } catch (error) {
      console.error("Login room error:", error);
      throw error;
    }
  }

  async startPublishingStream(streamID: string) {
    if (!this.zg) {
      throw new Error("Zego Engine not initialized");
    }

    try {
      this.localStream = await this.zg.createStream();
      await this.zg.startPublishingStream(streamID, this.localStream);
      console.log("Start publishing stream success");
      return this.localStream;
    } catch (error) {
      console.error("Start publishing stream error:", error);
      throw error;
    }
  }

  async startPlayingStream(streamID: string) {
    if (!this.zg) {
      throw new Error("Zego Engine not initialized");
    }

    try {
      const remoteStream = await this.zg.startPlayingStream(streamID);
      this.remoteStreams.set(streamID, remoteStream);
      console.log("Start playing stream success");
      return remoteStream;
    } catch (error) {
      console.error("Start playing stream error:", error);
      throw error;
    }
  }

  stopPublishingStream(streamID: string) {
    if (!this.zg) {
      throw new Error("Zego Engine not initialized");
    }

    this.zg.stopPublishingStream(streamID);
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
  }

  stopPlayingStream(streamID: string) {
    if (!this.zg) {
      throw new Error("Zego Engine not initialized");
    }

    this.zg.stopPlayingStream(streamID);
    this.remoteStreams.delete(streamID);
  }

  logoutRoom() {
    if (!this.zg) {
      throw new Error("Zego Engine not initialized");
    }

    this.zg.logoutRoom();
  }

  destroy() {
    if (this.zg) {
      this.zg.destroyEngine();
    }
    this.zg = null;
    this.localStream = null;
    this.remoteStreams.clear();
  }
}

const zegoCloudService = new ZegoCloudService();
export default zegoCloudService;
