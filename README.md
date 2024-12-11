<p align="center">
  <img src="public/media/LOGO_WITH_NAME.svg" alt="Logo" height="200">
</p>

- [Introduction](#introduction)
- [Requirements](#requirements)
- [Multi-Tenancy and Subscriptions](#multi-tenancy-and-subscriptions)
- [Additional Documentation](#additional-documentation)
- [Maintainers](#maintainers)
- [Acknowledgments](#acknowledgments)
- [Contribute](#contribute)
- [Issues and requests](#issues-and-requests)

## Introduction

NexusML UI is a React-based web application designed to serve as the user interface for the [NexusML](https://github.com/neuraptic/nexusml).

We'll be releasing the first version of NexusML UI very soon. In the meantime, you can explore the [release/0.1.0](https://github.com/neuraptic/nexusml-ui/tree/release/0.1.0) branch.

Please refer to [nexusml/docs/what-is-nexusml.md](https://github.com/neuraptic/nexusml/blob/main/docs/what-is-nexusml.md) and [nexusml/docs/concepts.md](https://github.com/neuraptic/nexusml/blob/main/docs/concepts.md) for an overview of NexusML and its key features and concepts.

## Requirements
* [Node.js](https://nodejs.org/en)
* [Auth0](https://auth0.com/) configuration for user authentication

## Multi-Tenancy and Subscriptions

NexusML UI is designed with multi-tenancy in mind, enabling multiple organizations (tenants) to use the platform 
independently within isolated workspaces. Each tenant has its own environment, where organization members can 
collaborate on tasks, manage data, and deploy AI models without affecting other tenants.

> ℹ️ Multi-tenancy requires [Auth0](https://auth0.com/) for user authentication.

## Additional Documentation

The [docs](docs) directory contains additional documentation:

- [auth0.md](https://github.com/neuraptic/nexusml/blob/main/docs/auth0.md): Describes the Auth0 configuration for NexusML UI.
- [quickstart.md](QUICKSTART.md): Provides a quick start guide for NexusML UI.
- [states-and-statuses.md](https://github.com/neuraptic/nexusml/blob/main/docs/states-and-statuses.md): Describes NexusML UI's states and statuses.
- [what-is-nexusml-ui.md](https://github.com/neuraptic/nexusml/blob/main/docs/what-is-nexusml.md): Provides an overview of NexusML UI.

## Maintainers

NexusML UI is maintained by the following individuals (in alphabetical order):

- Miguel Perez Martinez ([@miguelperezmartinez](https://github.com/MiguelPerezMartinez))

## Acknowledgments

We would like to recognize the valuable contributions of the following individuals (in alphabetical order):

- Enrique Hernández Calabrés ([@ehcalabres](https://github.com/ehcalabres))
- Vladyslav Naumenko ([thepureinx000](https://github.com/thepureinx000))


## Contribute

All the guidelines are available at the [contributing](CONTRIBUTING.md) file, so make sure that your code and
documentation follow all the instructions there before completing any contribution.


## Issues and requests

All the issues and feature requests must be created at the [issue](https://github.com/neuraptic/nexusml-ui/issues)
section of the official NexusML UI repository, and all the following discussions will be handled there.
