<p align="center">
  <img src="public/media/LOGO_WITH_NAME.svg" alt="Logo" height="200">
</p>

<br>

# NexusML UI

- [NexusML UI](#nexusml-ui)
  - [Introduction](#introduction)
  - [Requirements](#requirements)
  - [Multi-Tenancy and Subscriptions](#multi-tenancy-and-subscriptions)
  - [Additional Documentation](#additional-documentation)
  - [Maintainers](#maintainers)
  - [Acknowledgments](#acknowledgments)
  - [Contribute](#contribute)
  - [Issues and requests](#issues-and-requests)

## Introduction

NexusML is a multimodal AutoML platform for classification and regression tasks.

We'll be releasing the first version of NexusML very soon. In the meantime, you can explore the [release/0.1.0](https://github.com/neuraptic/nexusml-ui/tree/release/0.1.0) branch.

Please refer to [docs/what-is-nexusml.md](https://github.com/neuraptic/nexusml/blob/main/docs/what-is-nexusml.md) and [docs/concepts.md](https://github.com/neuraptic/nexusml/blob/main/docs/concepts.md) for an overview of NexusML and its key features and concepts.

## Requirements
* [Node.js](https://github.com/nodejs/Release)
* [Auth0](https://auth0.com/) configuration for user authentication

## Multi-Tenancy and Subscriptions

NexusML is designed with multi-tenancy in mind, enabling multiple organizations (tenants) to use the platform 
independently within isolated workspaces. Each tenant has its own environment, where organization members can 
collaborate on tasks, manage data, and deploy AI models without affecting other tenants.

> ℹ️ Multi-tenancy requires [Auth0](https://auth0.com/) for user authentication. Please refer to 
> [docs/auth0.md](docs/auth0.md) for instructions on setting up Auth0 for NexusML.

NexusML allows you to create and customize subscription plans, adjusting quota limits (such as storage and compute 
resources) to meet the specific needs of different organizations.

> ℹ️ Billing and payment processing are not implemented. To use NexusML in a production environment, you will need to 
> integrate a billing and payment system such as [Stripe](https://stripe.com/). To do this, you will need to override 
> the `nexusml.api.jobs.periodic_jobs.bill()` function.

## Additional Documentation

The [docs](docs) directory contains additional documentation:

- [architecture.md](https://github.com/neuraptic/nexusml/blob/main/docs/architecture.md): Describes the architecture of NexusML.
- [auth0.md](https://github.com/neuraptic/nexusml/blob/main/docs/auth0.md): Describes the Auth0 configuration for NexusML.
- [quickstart.md](quickstart.md): Provides a quick start guide for NexusML.
- [states-and-statuses.md](https://github.com/neuraptic/nexusml/blob/main/docs/states-and-statuses.md): Describes NexusML's states and statuses.
- [what-is-nexusml.md](https://github.com/neuraptic/nexusml/blob/main/docs/what-is-nexusml.md): Provides an overview of NexusML.

## Maintainers

NexusML is maintained by the following individuals (in alphabetical order):

- Miguel Perez Martinez ([@melkilin](https://github.com/MiguelPerezMartinez))

## Acknowledgments

We would like to recognize the valuable contributions of the following individuals (in alphabetical order):

- Enrique Hernández Calabrés ([@ehcalabres](https://github.com/ehcalabres))
- Vladyslav Naumenko ([thepureinx000](https://github.com/thepureinx000))


## Contribute

All the guidelines are available at the [contributing](CONTRIBUTING.md) file, so make sure that your code and
documentation follow all the instructions there before completing any contribution.


## Issues and requests

All the issues and feature requests must be created at the [issue](https://github.com/neuraptic/nexusml-ui/issues)
section of the official NexusML-UI repository, and all the following discussions will be handled there.
