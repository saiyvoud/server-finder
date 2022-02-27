// import admin from "firebase-admin"

// import { initializeApp } from 'firebase-admin/app';
// import * as accountKey from '../../google-services.json'

// initializeApp({
//     credential: firebase.credential.cert(accountKey),
//     databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
// });

// await admin.messaging().sendMulticast({
//   tokens: ["token_1", "token_2"],
//   notification: {
//     title: "Weather Warning!",
//     body: "A new weather warning has been issued for your location.",
//     imageUrl: "https://my-cdn.com/extreme-weather.png",
//   },
// });

import admin  from "firebase-admin"

// import serviceAccount from "../../serviceKey.json"

const serviceKey = {
    "type": "service_account",
    "project_id": "send-msg-b8be1",
    "private_key_id": "0a6e7d8522cfefff79dc6cd2d00aef961affa0d7",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5L1srP9U+WlO5\nfLDG3pw9TK3GAhFPLPBE5NQCoMGePIkPZy0PSKyLQSSRo6rn4HMPmD0IUNvG+ol5\nAHTW6Bs41dg+mNm8ZOQ4n38NsoCIL43kLHGJmswZofS2iZ2d55ukGezFJG0/VOTh\nY960T8zKl0AuIDpeUo5z1/G3j/sFh1fQrjTni+vGGJ5llT+N+PbqTAHOWSVV+sIZ\nQy46S+ZiFiwJrMeEB6K2KucJ6dB9X4ozqN9lspyf7nsCMxkSlf6hBdERdI8QrVOZ\nhNyq0mkwwwjMOgckIAA4haxPz9Vys/LYIIDpVDkXGmWUiVbN01fKpRU8D3Kp0at8\nhC2J/93zAgMBAAECggEACmEAlstBL0YoJIbvPRFZ9JRfgu/RVFYvWAHy1GJ59F2H\nmWqBDuoityIdPUczVRA/DEDOK7ELq4dilnqmxPeFgXYR/h3AylT/Q4f3VE2zJxU/\nOlDq9h+yaiQp6OPyoD7l+fJBoAguhU4QdYXZUNLOJnNus4cdeyh2Xacpn+ejPCGx\n5fGQDZtbWXK9oHe+qhDeTGXR/73Kd7hDFFQyY17xvw20lvDQ+fRPNerHHzMkCZBV\n++2NvUcJAb+4pQDvd6Hbg1gjlh4+5L0TR9At/5xugsY60Kjvbr8g5Zke7y0fPw9W\n5s5V8y5ogt86lJBHMANFBTC32NeBZnP/GmDCDch6UQKBgQD1JDIAgXAvhE9AC3aD\nEGHiNNg3DNBul5OIHIGeor3SpxJYNwVZYvr0jERk8Ik6TV/u1T2E3boyGXk7MOoz\n0jUrFjSNMhulujnOf2VJDw1isg31Io3WRxlETMIV3pfiu4awhUTgJm85xEiZgU3r\nxYqfhosz+VJZ9+VdF5MaUEKZ4wKBgQDBY0eCAeKLxOnD1CN+iYNKLMU3zELNH1PG\nQgdMJH+tPGNJcgb31+B18fMJbBhRAAPDsL+cfTmcWhg4O508jggbdhmmLna/Wp8J\nZkv42XEBZI36Z9y8DeggqFT98NzXDfL9MGsn4vNZJ+s9T4INI4DX9aRJUchHnDaJ\nEOtGMPgosQKBgQCpYZgXF1jPzEkCBKmfh9tKdJ8M8pK2R4+N1byOQv6MJhqbz3Cn\nwaeK/7xmTnlTSpFFshuuyZHU+hr1FihNJCrOmao4AW5vBYzZrNbsMzVZg5P3VCfS\n7g98TNkySTqDVHWNVJgxlPz3WjObtWeEyFqvPUTD5brMJWha+WYQIXLTZwKBgC65\n6T49bFqvIniBmm3plgJnHOPlg8KCLkC6FX9NVlgqPicx2QMrcv2sjzeYmauAoGg5\nHaMXEsN3dWCo7s4B122jNIFVurVzlPe1cufWyho3DKMTU19Q0OSLJ7YP65w+r5aD\ni3CgwoGpRoqS2m6IRIppvN9GVmkPEpI9t0tHa76RAoGAROJqkznAhrxys4xgf65O\n7SA75wapmbkw1Gy7dK0NM3fl+m4/pvU2xngcrCsgJtah2BARG6ELNnyB9UOY2u7K\nxPYTwz2X78OPLQ64Z8umBiZo1ViFCaNvVY3oRBvfOz2QyoEab3NRZCJ8muGWeW7S\nWW0gk1RBAuqeZww9bVt1g1o=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-dtom8@send-msg-b8be1.iam.gserviceaccount.com",
    "client_id": "116206671668229516631",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-dtom8%40send-msg-b8be1.iam.gserviceaccount.com"
  }
  
  const keyAcc = {
    "type": "service_account",
    "project_id": "finders-service",
    "private_key_id": "ec1d6128cf660991b6cdf1564db1b341ac51b17d",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDIgI07P7Rn7MsC\nz9mf7z0UOyRe26N7hwTEyjX8E/dF59z+gFUgg5rT2ueNeLlpTMnoMVOzWOcxsGs6\nGynGPGZ2hOOVZDizGhP0YMTMTaKwZIJ6KpsChp8cDVCfcBK8o1hZUvVj8bdFZayK\nv9sO9Mm1dDONerv4HtuzTCbIEm49DNuM7XLBanCrkKlPShZ5vMCQhsASrVkKh2mx\nk/JhZ1cZkg87DtU8ladIGYv2SBPSziFWPK2oSZQ4pyHeNvGv1++e7X1Gg1F4gz2y\nlTL48S2PqQc1ronGHFvkv9mNLUleDmJqPh+TfmignUCJXEUnWmh/GS9XT7+kyq6X\nbO/3T6ntAgMBAAECggEAMUt/zasYLvvmHrMc+Ygff3eZ9dNw0nhL6RkhJDCBeTes\nGwtQwp1wpbkaeGsPxM6bDoIAJuZK8ynBdygCAYnMlEOQU6SwFwKomMro36UPxGf1\nt1T9xuVzvXkdkxGCHcxYNp/hkpi1WzPH89X/JOJ0rC7dVOGx0Ks/j0m/+C0l2s68\ny1zhgk+fHEkOL+nyfkYyehBl9nPzNHsYV12kDkQ6pcLugGlyX2eA8AeZdJs2Z6yA\nxFy2yvnVwiTvIFe59CJRFdrB9enwBHRMzd3WYC2za5LPspf/ssbHuWeIu13QvGHr\n6ic+cikfTLu+UpCERevPDNAD+ZDXAFUZrCOAbNSZyQKBgQDlYGo7khX0ujHVFOkT\nnal2L19ay7XahFlAzOGVVgQ9N/TBOQJVBhXgRvU+dxapdE8xUta9SKso0A8YFp1g\n1et9d0tNk+fE/Wkshlv/W6iVwSHWbayJuTVZkaxdQIjGEptltjerzZ8CRZT42ksc\nvC/qrD6FIpyskydQ6pay0vizVQKBgQDfxizHWpdQgKFXO709HhpfZCmltqk8NWSP\nKk96QIxFuHSLMwVDZloV41bXwl1v5mRFOhjYAJEMzrsnh5TTlEtBGgw75aAvaA8W\nm5el77/MpFyM+iOvpw1tJRJ5eAtFZ1iXpWroIWkXFaL9KPuDVLoPbHZwRNIkebkZ\nxhiZIujMOQKBgQC2ATUKI7asQ3n7G+Z9nCK1Fo3RG8cmptGza16sAl7GvLnHABdr\no7KEDYnXkOM4foPAHX0rIJg/gCgZ8wfZqKR9H8Vuvyeu1W042TvyeaZhfaf933SC\nq6U7dy2PqP9eO7F2mYm/Fx9OzCuS8pObL2/OA/Jv7bDn9rPBrwL4zhJtKQKBgQCL\nxzVnXU4Rahfd7qH5kFk25tEhAyVZR5zF1M8KdVFpp5uc68TI4iE5dOVlJrLI2Cgg\nGfc0zb3NO0EqowUy2Hndc5DaxUe29RAfthcW/thW0wBAy2sJKJc5ayPMHlEkDDcJ\nmrlZwKztT4WdD0F0OrNyOPUOkd6WDDa0Q8pPtb+m+QKBgQCFYt5DedYXGnxOBnWS\nVmKBT6XYZPiFti2Ny2rYZercwA+DIf+4HqpGQWGBC5WF7uLncLLrOML1TEaCgJHc\ndPToxXzXrWSQXk9fOTtwZQuIM7qkuL062iumc/EOR3IV38Efzr81enltC1Lifntc\nGeJSY4QEy4iReI/2XsepM1qQ9g==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-d1da4@finders-service.iam.gserviceaccount.com",
    "client_id": "111350703641559634581",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-d1da4%40finders-service.iam.gserviceaccount.com"
  }

admin.initializeApp({
  credential: admin.credential.cert(keyAcc)
});

export default admin;