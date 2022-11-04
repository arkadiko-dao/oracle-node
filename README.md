# Arkadiko Oracle Node

## Introduction

An oracle node should periodically check if the prices on chain should be updated.
If so, the node will fetch the price from its source and asks all other nodes to sign the price.
Nodes will only sign the price if the value is within a certain range from the price they got from their source.
Once all signatures are gathered, the price info and signatures are pushed on chain.

## Setup
- Create `.env` file, see `.env.example`
- Set up cron job to run script `....`
- TODO

## Local setup
- Create `.env` file, see `.env.example`
- Run `npm run dev`
- TODO
