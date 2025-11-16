const socket = io();
let localStream;
let peerConnection;
let isHost = false;
let remoteSocketId = null;
const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

async function getMedia() {
  return await navigator.mediaDevices.getUserMedia({ audio: true });
}

function startCall() {
  isHost = true;
  socket.emit("host-joined");
  document.getElementById("status").innerText = "Waiting for users...";
}

function joinCall() {
  socket.emit("get-hosts");
}

socket.on("update-users", (users) => {
  const list = document.getElementById("peerList");
  list.innerHTML = "<h3>Available Hosts:</h3>";
  users.forEach((user) => {
    const btn = document.createElement("button");
    btn.innerText = `Connect to ${user.id}`;
    btn.onclick = () => {
      remoteSocketId = user.id;
      socket.emit("join-request", user.id);
      document.getElementById("status").innerText = "Request Sent...";
    };
    list.appendChild(btn);
  });
});

socket.on("incoming-join", async (peerId) => {
  const accept = confirm(`User ${peerId} wants to join. Accept?`);
  if (!accept) return;

  remoteSocketId = peerId;
  localStream = await getMedia();

  peerConnection = new RTCPeerConnection(servers);
  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

  peerConnection.onicecandidate = (e) => {
    if (e.candidate) {
      socket.emit("signal", { to: remoteSocketId, data: { candidate: e.candidate } });
    }
  };

  peerConnection.ontrack = (e) => {
    const audio = new Audio();
    audio.srcObject = e.streams[0];
    audio.play();
    document.getElementById("status").innerText = "Connected";
    document.getElementById("toggleAudio").style.display = "inline-block";
  };

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  socket.emit("signal", { to: peerId, data: { sdp: offer } });
});

socket.on("signal", async ({ from, data }) => {
  if (!peerConnection) {
    remoteSocketId = from;
    localStream = await getMedia();
    peerConnection = new RTCPeerConnection(servers);

    peerConnection.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("signal", { to: from, data: { candidate: e.candidate } });
      }
    };

    peerConnection.ontrack = (e) => {
      const audio = new Audio();
      audio.srcObject = e.streams[0];
      audio.play();
      document.getElementById("status").innerText = "Connected";
      document.getElementById("toggleAudio").style.display = "inline-block";
    };

    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
  }

  if (data.sdp) {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
    if (data.sdp.type === "offer") {
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("signal", { to: from, data: { sdp: answer } });
    }
  } else if (data.candidate) {
    await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
  }
});

function toggleAudio() {
  if (!localStream) return;
  const audioTrack = localStream.getAudioTracks()[0];
  audioTrack.enabled = !audioTrack.enabled;
  document.getElementById("toggleAudio").innerText = audioTrack.enabled ? "Mute" : "Unmute";
}
 