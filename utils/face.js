import Constants from "expo-constants";
import axios from "axios";
const API_KEY = Constants.manifest?.extra?.azureApiKey;
const endpoint = `https://face-attendance.cognitiveservices.azure.com/face/v1.0/`;

const instance = axios.create({
  baseURL: endpoint,
  headers: {
    "Content-Type": "application/json",
    "Ocp-Apim-Subscription-Key": API_KEY,
  },
});

export const detect = async (uri) => {
  try {
    const data = await fetch(uri);
    const blob = await data.blob();
    const response = await fetch(
      endpoint +
        "detect?returnFaceId=true&recognitionModel=recognition_04&detectionModel=detection_03",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
          "Ocp-Apim-Subscription-Key": API_KEY,
        },
        body: blob,
      }
    );
    return response.json();
  } catch (err) {
    console.log(err.json());
  }
};

export const createPersonGroup = async (name) => {
  try {
    console.log(name);
    const response = await fetch(endpoint + `persongroups/${name}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": API_KEY,
      },
      body: JSON.stringify({
        name: "ISE_Group",
        userData: "Group to store persons from ISE 2018 batch",
        recognitionModel: "recognition_04",
      }),
    });
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const getPersonGroup = async (name) => {
  try {
    const response = await fetch(endpoint + `persongroups/${name}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": API_KEY,
      },
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};
export const createPerson = async (user, groupId) => {
  try {
    console.log(user, groupId);
    const response = await fetch(
      endpoint + `/persongroups/${groupId}/persons`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": API_KEY,
        },
        body: JSON.stringify({
          name: user.name,
          userData: user.id,
        }),
      }
    );
    return response.json();
  } catch (err) {
    console.log(err);
  }
};
export const getPerson = async (groupId, personId) => {
  try {
    const response = await fetch(
      endpoint + `/persongroups/${groupId}/persons/${personId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": API_KEY,
        },
      }
    );
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

export const getPersonList = async (groupId) => {
  try {
    const response = await fetch(
      endpoint + `/persongroups/${groupId}/persons`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": API_KEY,
        },
      }
    );
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

export const deletePerson = async (groupId, personId) => {
  try {
    const response = await fetch(
      endpoint + `/persongroups/${groupId}/persons/${personId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": API_KEY,
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
};

export const addFaceToPerson = async (groupId, personId, uri) => {
  try {
    const data = await fetch(uri);
    const blob = await data.blob();
    const response = await fetch(
      endpoint + `/persongroups/${groupId}/persons/${personId}/persistedFaces`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
          "Ocp-Apim-Subscription-Key": API_KEY,
        },
        body: blob,
      }
    );
    return response.json();
  } catch (err) {
    console.log(err);
  }
};
export const trainPersonGroup = async (groupId) => {
  try {
    await fetch(endpoint + `/persongroups/${groupId}/train`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": API_KEY,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export const identifyFace = async (uri, groupId) => {
  try {
    const data = await detect(uri);
    const faceId = data[0]?.faceId;
    const faceIds = [faceId];
    const response = await fetch(endpoint + `/identify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": API_KEY,
      },
      body: JSON.stringify({
        personGroupId: groupId,
        faceIds: faceIds,
        maxNumOfCandidatesReturned: 1,
        confidenceThreshold: 0.8,
      }),
    });
    return response.json();
  } catch (error) {
    console.log(error);
  }
};

// export const identifyFace = async (groupId, uri) => {
//   try {
//     const results = await detect(uri);
//     console.log(results);
//     const faceIds = results?.faceId;
//     const response = await instance.post(`/identify`, {
//       personGroupId: groupId,
//       faceIds: faceIds,
//       maxNumOfCandidatesReturned: 1,
//       confidenceThreshold: 0.8,
//     });
//     return response.data;
//   } catch (err) {
//     console.log(err.toJSON());
//   }
// };

export const verifyFace = async (faceId, personId, groupId) => {
  try {
    const response = await instance.post(`/verify`, {
      faceId: faceId,
      personId: personId,
      personGroupId: groupId,
    });
    return response.data;
  } catch (err) {
    console.log(err.toJSON());
  }
};
