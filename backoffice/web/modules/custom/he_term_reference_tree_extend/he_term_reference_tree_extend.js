(function ($) {

  /**
   * Attaches the tree behavior extend to the term widget form.
   */
  Drupal.behaviors.termReferenceTreeExtend = {
    attach: function (context) {
      var groupVersusSelector1 = [
        '#edit-field-document-category-0-1-1-children-10-10-children-12-12', // If this checkbox group is selected ...
        '#edit-field-document-category-0-1-1-children-11-11-children-14-14' // ... Then this one is disabled and vice versa.
      ];

      // var groupVersusSelector2 = [
      //   '#edit-field-document-category-0-2-2-children-15-15-children-18-18',
      //   '#edit-field-document-category-0-2-2-children-16-16-children-20-20'
      // ];

      $('.term-reference-tree', context).once('term-reference-tree-extend').each(function () {
        // Disable checkMaxChoices() in modules/contrib/term_reference_tree/term_reference_tree.js.
        $(this).find('input[type=checkbox]').off('change');

        var $tree = $(this);

        function isGroupExist(groupSelector) {
          var selectors = groupSelector.join(','),
            $elements = $(selectors);

          return $elements.length === 2;
        }

        function getInputGroup(selector) {
          return $tree.find(selector).closest('.term-reference-tree-level').find('.form-checkbox');
        }

        function disableInputGroup(selector) {
          var $inputGroup = getInputGroup(selector);
          $inputGroup
            .prop('disabled', true)
            .parent().addClass('disabled');
        }

        function enableInputGroup(selector) {
          var $inputGroup = getInputGroup(selector);
          $inputGroup.prop('disabled', false)
            .parent().removeClass('disabled');
        }

        function initGroups(groupSelector) {
          $.each(groupSelector, function (index) {
            var thisSelector = groupSelector[index],
              targetIndex = (index === 0) ? 1 : 0,
              targetSelector = groupSelector[targetIndex];

            var $inputGroup = getInputGroup(thisSelector),
              isChecked = $inputGroup.is(':checked');

            if (isChecked) {
              disableInputGroup(targetSelector);
            }

            $inputGroup.change(function () {
              var is_checked = $inputGroup.is(':checked');

              if (is_checked) {
                disableInputGroup(targetSelector);
              }
              else {
                enableInputGroup(targetSelector);
              }
            });
          });
        }

        // Init script.
        if (isGroupExist(groupVersusSelector1)) {
          initGroups(groupVersusSelector1);
        }

        // if (isGroupExist(groupVersusSelector2)) {
        //   initGroups(groupVersusSelector2);
        // }
      });
    }
  };

})(jQuery);
