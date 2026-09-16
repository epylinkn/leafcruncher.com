---
title: "operation: criminal cryptokitty"
date: 2019-05-09
tags: [machine learning]
location: new york, new york
role: "artist & engineer"
authorship: mine
collaborators: ["Jenna Xu"]
homelayout: landscape
homeimage: /img/projects/criminal-cryptokitty.webp
homedescription: "a neural network that decides which cartoon cats look like criminals"
draft: false
---

a neural network that looks at a cartoon cat and decides whether it belongs in jail. it is phrenology — rebuilt more or less as published, then pointed at digital collectibles instead of people. final project for electronic rituals at itp.

{{< image/hero src="criminal-kitty.webp" alt="the scowling cryptokitty that started the project" caption="this project inspired by this lovely kitty i bred, which i admit looks like a criminal..." >}}

## why

i'd been spending a lot of time in the dark, neckbeard basements of blockchain, and a lot of time reading about human rights and ethics. the physiognomy reading for class stuck with me — not because it's junk science, but because people are actually using it.

xiaolin wu and xi zhang's paper, *automated inference on criminality using face images*, claims machine learning can predict whether someone is a convicted criminal with nearly 90% accuracy from nothing but a driver's-license-style photo. their study leans on about 500 portraits of felons, and the images were never properly controlled. faception, meanwhile, sells specialized engines that recognize "high iq", "white-collar offender", "pedophile" and "terrorist" from a face.

and beyond the obviously visceral reactions to phrenology, opaque algorithms encode subtler biases too — there are self-driving cars that do a poor job of detecting dark-skinned pedestrians.

but alas, it seems people avoid these heavy topics. so: cats.

## cryptokitties

cryptokitties are breedable, collectible cats that live on the ethereum blockchain — non-fungible tokens that aren't used as currency. each one is genuinely owned by whoever holds it, which spawned an entire world of "true ownership" and "digital collectibles". celestial cyber dimension, a one-of-a-kind kitty, sold for $140,000.

they also have real genetics: a backbone of genotypes and phenotypes, dominant and recessive genes, mutations, and eight primary cattribute categories — fur/body, pattern, eye color, eye shape, base color, highlight color, accent color, and mouth.

and they're adorable. the internet *is* cats. people feel genuine joy and love toward their own kitties, which is exactly what makes them a good vector for a statement about algorithmic bias.

## the labeling is the project

there is no database of criminal kitties. that's the best part — it hands you the beautiful opportunity to do shoddy data collection, meaning to invent your own labels. instead of real data, we used people's gut reactions to cryptokitty images.

we scraped the cryptokitties api with python and pulled the images down. then we built our own web labeler and ran the same job through mechanical turk to compare. turk won: it has quality control built in, and it mirrors the way image classification datasets actually get labeled in the real world. one pass, and the results were surprisingly good.

{{< image/hero src="mturk-task.webp" alt="the mechanical turk task preview: 'does this cat look like a criminal?' above a cryptokitty image, with yes and no buttons" caption="the hit, as a worker saw it. 200 tasks, one cent each, no qualifications required." >}}

the task was titled *phrenology of cryptokitties — image classification*. the question was "does this cat look like a criminal?" the options were yes and no.

that is the whole argument compressed into one screen. the ground truth for "criminal" is a stranger's snap judgment, bought two hundred at a time at a penny apiece. this is also how the real ones are made.

## the model

a neural network is probably overkill for this. that's the point — what i find fascinating about neural networks is their opaqueness, and so their deniability of blame when questioned.

trained in a python notebook, served over a small falcon web api, and demoed as a chrome extension that puts criminal kitties behind bars on the marketplace — literal bars, drawn over the listing, with DO NOT BUY where the price should be.

{{< image/hero src="jailed-kitties.webp" alt="the cryptokitties marketplace with the extension running: flagged kitties sit behind jail bars, each labelled 'this kitty is criminal' and 'do not buy'" caption="the same marketplace, sentenced." >}}

## what it's actually about

cryptokitties were built to teach people about the blockchain. cryptokitty physiognomy was built to teach about the scientific racism hiding inside machine learning.

we don't care about labeling humans as criminals as much as we should. but maybe we'll care more about locking up digital collectible cats — and that gap is the finding.

the roots of physiognomy lie in the human propensity to interpret a person's appearance associatively, metaphorically, and even poetically. the roots of this project are the same, minus the person.

## reading

- [physiognomy's new clothes](https://medium.com/@blaisea/physiognomys-new-clothes-f2d4b59fdd6a)
- [a new study finds a potential risk with self-driving cars: failure to detect dark-skinned pedestrians](https://www.vox.com/future-perfect/2019/3/5/18251924/self-driving-car-racial-bias-study-autonomous-vehicle-dark-skin)
- [who spends $140,000 on a cryptokitty?](https://www.nytimes.com/2018/05/18/style/cryptokitty-auction.html)
- [the anatomy of erc721 (non-fungible tokens)](https://medium.com/crypto-currently/the-anatomy-of-erc721-e9db77abfc24)
- [the cryptokitties genome project](https://medium.com/@kaigani/the-cryptokitties-genome-project-68582016f687)
