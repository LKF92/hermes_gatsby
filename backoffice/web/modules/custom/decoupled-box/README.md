INTRODUCTION
------------

*Decoupled Toolbox* contains common features for decoupled websites.

REQUIREMENTS
------------

This module has been developed on Drupal core 8.8+. May not work on older
versions.

INSTALLATION
------------

 * Install as you would normally install a contributed Drupal module. Visit
   https://www.drupal.org/docs/8/extending-drupal-8/installing-drupal-8-modules
   for further information.

CONFIGURATION
-------------

On module install, a couple of view modes named "Decoupled" will be created.

You may then edit the related view displays on every content entity to set the
right formatter on fields.

Only decoupled formatters are compatible with the decoupled renderer.

As a quick example, you may access
/decoupled-api/{entity_type}/{bundle}/collection?offset=0&limit=10 to retrieve
the first entities.

*(documentation still in WIP)*
