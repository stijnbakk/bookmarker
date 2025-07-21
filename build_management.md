# Building management

## Towards an MVP

Actions

- [ ]

Technical debt

- [ ] Validate signup via email
- [ ] Delete pin
- [ ] Onboarding experience
- [ ] Social login
- [ ] Proper eror handling and monitoring usin Sentry or something
- [ ] Adding pinterest service, adding ping for service status, auto deployment to fly, good contracting in place, and versioning the API
- [ ] Service to screenshot web pages
- [ ] Service to crawl web page and extract content
- [ ] Service that auto-tags content

Dump

- [ ] (app) and (marketing) and (server) folder structure
- [ ] Add something

Dumping stuff

- Add a pin
  - Add a url
- Add a note to a pin
- Auto tagging a pin
- Rename a pin
- Add or remove tags from a pin
- Index keywords for search of a pin

Types to pin

- Storybook
- Shadcn
- Testing

- Pinterest service
- Instagram service
-

Questions to ponder

- What should homepage behavior be?

# What is the purpose of this app?

I want to be able to quickly bookmark stuff I find. Be that a quick note, a link, a video, an image, a pdf, whatever.
I want to be able to search for that.
I want to be able to tag it
I want to be able to add it to shared spaces

Okay, what do you want to bookmark?

- Links, can be a beautiful website, or an article
- Links can also be a pdf, or video, or an image, in that case I want those things as the pin
- Images, which I upload myself.

Okay, what do I want to do.
Let's build a simple pinterest bookmarker.

Architecture that emerges

- Web
- Apps
- Services
  - Pinterest
  - Article
  - Web image
  - Image
  - PDF
  - Video
  - Instagram
  - Twitter
-
