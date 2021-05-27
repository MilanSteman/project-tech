# Konnect &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

## Description

Konnect is a matching app made to connect you with people that share the same interests as you.

## Feature

The chosen feature consists of creating and updating a profile. The data stored ranges from user input to file input. The app will display other (recommended) users to you pulled from the database.

## Packages used

-   dotenv
-   eslint
-   express
-   mongodb
-   multer
-   node-sass
-   nodemon
-   nunjucks
-   prettier

## Database structure

```Javascript
Collection: users
{
    _id: ObjectId("609fec310cd4f4017c357971")                       ObjectId
    name: "Milan"                                                   String
    description: "Sed ut perspiciatis unde omnis iste..."           String
    category: "Games"                                               String
    avatar: "avatar-1621093425526.jpg"                              String
    banner: "banner-1621093425523.jpg"                              String
}
```

## Installation

Make sure that git is installed on your machine:

```
$ sudo apt-get update
$ sudo apt-get install git
```

Clone the repository and install the packages:

```
$ git clone https://github.com/MilanSteman/project-tech.git
$ npm install
```

## Getting started

Start the application with:

```
$ npm start

Example app listening at http://localhost:3000
```

## Documentation

You can find the documentation on [the wiki](https://github.com/MilanSteman/project-tech/wiki).

## License

The application is [MIT licensed](./LICENSE).
