import admin from "firebase-admin";

const serviceAccount = {
  "type": "service_account",
  "project_id": "miltech-c3007",
  "private_key_id": "dbbfd7540d9fc6d6ccfc928a0d9869f46e053e85",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCwWn7+h2c0NrMy\n1Bl7T0rOREzE7bc12GODatA42RgBxRwZyqjS0wNOPKOIti1kQ9a3SwIzfNaw/YKk\nLu+m/bvrH1JZpjBqK6LNVxRIsNbjANFrwcUaSMzIcfhPfjaFIHmNqYHIej6uR1D0\nuaBORLhoHiwmV/VmH9AjCvWYWCLtY06YxFciyUP+xb6ifMXlqmnrN3xlWU9YPD0B\nOUGqJnBUjKb3dYnYQenHdcbo5Na6DobBSzcfMKbNytEb9AjcCJ+ljIdgE91oZNn4\n8NIzCwTizGnqnrN0wCTSESm9dYoezHspcunRyb/68LLovk06FbKE6hUSCJC8EUtg\nfPWTJLEjAgMBAAECggEAKps6ilD5UKaUhcezflSqXIoox/0sodAtPq9cLhfZEnhm\nMR8CyaicaFcDJYDqF4rCQddX6UuUbP9ahEMouD4eHBCdqzYZBVWUiCqtJmC/Een9\nLp0Key6ydwz98mqqTmCJrX2R8vcB1MY7G10Li01UBiegAAWJLsqp1QWNT2ify50n\nRU8wLnyQjqVJUJxgl/tbaQpVGyh8hZHDbCnvYYNXYvlDemkvdudv5XFRJaS5c+IN\nNq8lk0/etzbi3ldmZdAwPlcNN7kop6BNfLAAWG9zP04Ltz2SRhetVOAVE1bKrhph\n+3WF3RhH/Sms/qE5HxpLnGwW9KpDpPBaoTNG2Ff6xQKBgQDa/L2dbLrN/WEk+3uX\nLnszwbJg8SIiK97OgcyJYim1u78Gqmeb3hNhjP9CvH3U6ZInBpuHqaAtsZG+PFR3\n730M9Zs2YyzvkpikWtwZ0VK/TaoD0uRYfBcZJ54S9PESQtfDW4dBd6CyiZKLkw/v\n3Cn4zXS8BRx90caXLsBSzaKcpQKBgQDOKQ3z6f42Dn3lZOnt4hZxjMG6TJHJ2+IE\n/jXYFcHH9HFEDNsQ+NVTuVLdJeFsZt/vvG02qKgqzljPh3IGPMVK8LEUNw+u3xIk\ntKbpvH/wTIrSNITauNx4TKiwAtSU4gat9eFabWoWg558DSenpYoXC1optKoJqebb\nEelCbEdEJwKBgQC/12wxbmBUNuYUpO9HqSOrWsPvIy+46d/d314U+Nb7a0dVCpGL\nvcgSzJeOmlxN2nT8FVDJTzOQ9B9unaGOFFLjuIJJ6iYilrV8PlDVmUg5aUtI4EbE\nsaj2k3tqtgQ+8Cne7d8W3jr8TYMBHUt34NMwMKVUVdH4835bUUyQ/a64NQKBgHJD\nxvv+IWwMtDLEr/OtcAsXnPiJH/Tl7mweCfHufS06itzQ00qg4Hw7J3ZzXHIcwtm5\ncj7tU+gF3quHwuc6H4/dwAgYTJT8Bq5ZgnnihHbHtdm0Sj6AX5I9yvFjYDf03wbk\nVTctlbNM2Dahg+0jj1oebKbY/7XDebTKRKMQKJ/ZAoGAW7mBQ5WIX52uVlntt19w\nRtapgNGuMF3s2o5BtABzqo4DFnFzzKHR5I+WouyE+7XVxmEyYTyUCC5Oqu2untvq\nNXF8Pnb7qqE+7JUlavN1M3O5CnWV6g9NUm2fKiY1zUdlVKJfAEDDvl2n1To0XJ/p\n4Gvq2q5Skq3Wunmey9rKXmw=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@miltech-c3007.iam.gserviceaccount.com",
  "client_id": "115283196043936857419",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40miltech-c3007.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;