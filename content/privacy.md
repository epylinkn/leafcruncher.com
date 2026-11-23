---
title: "privacy"
date: 2026-11-23
---

this page covers leafcruncher.com and the private google api app "rexmac gmail".

## this website

leafcruncher.com is a static portfolio site. it has no accounts, no forms, and no comments. it does not set cookies of its own or run analytics. the host, netlify, keeps ordinary server logs (ip address, browser, pages requested) as any web host does.

## rexmac gmail

"rexmac gmail" is a personal tool made by anthony for his own use. it connects to one google account, his own, so that software running on his own computer can search, read, label, archive and draft email on his behalf.

**what it accesses.** with the account owner's explicit consent, it uses the gmail scope `https://www.googleapis.com/auth/gmail.modify` (read, label, archive, and compose email; it cannot permanently delete).

**where data goes.** the oauth token is stored on the account owner's own computer. email content is read by that computer on request. it is not copied to any server run by me, not published, not sold, and not shared with advertisers or any third party. no one else's google account is connected to this app, and it is not offered to the public.

**limited use.** the app's use of information received from google apis adheres to the [google api services user data policy](https://developers.google.com/terms/api-services-user-data-policy), including the limited use requirements. google user data is used only to provide the features the account owner asks for, and is not used for advertising or to train generalized ai models.

**ai assistants.** when the account owner asks an ai assistant (claude, made by anthropic) to look at his email, the messages he asks it to read are sent to that assistant to answer his request, under his own account's terms with that provider.

**revoking access.** access can be removed at any time at [myaccount.google.com/permissions](https://myaccount.google.com/permissions), and deleting the token file on the computer ends it too.

## contact

questions: anthony@leafcruncher.com

last updated november 23, 2026.
