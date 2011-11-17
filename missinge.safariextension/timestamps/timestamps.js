/*
 * 'Missing e' Extension
 *
 * Copyright 2011, Jeremy Cutler
 * Released under the GPL version 2 licence.
 * SEE: GPL-LICENSE.txt
 *
 * This file is part of 'Missing e'.
 *
 * 'Missing e' is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * 'Missing e' is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with 'Missing e'. If not, see <http://www.gnu.org/licenses/>.
 */

/*global $,locale,safari */

function loadTimestamp(item) {
   var lang = $('html').attr('lang');
   /* Comment this section to enable timestamps
   if (!/^\/(inbox|messages|submissions)/.test(location.pathname) &&
       !/^\/blog\/[^\/]*\/(messages|submissions)/
         .test(location.pathname)) {
      return false;
   }
   */
   if (item.tagName === "LI" && $(item).hasClass("post") &&
       $(item).attr("id") !== "new_post" &&
       $(item).find('.private_label').length === 0) {
      var tid = $(item).attr("id").match(/[0-9]*$/)[0];
      var perm = $(item).find("a.permalink:first");
      var addr, type, stamp;
      if (/^\/(inbox|messages|submissions)/.test(location.pathname) ||
          /^\/blog\/[^\/]*\/(messages|submissions)/
            .test(location.pathname)) {
         type = 'ask';
         addr = 'http://www.tumblr.com/edit/';
         stamp = '';
      }
      else if (perm.length > 0) {
         type = 'other';
         addr = '';
         stamp = perm.attr('title').replace(/^.* \- /,'');
      }
      if (tid === undefined || tid === null || tid === "" ||
          addr === undefined || stamp === undefined || stamp === null) {
         return;
      }
      var div = $(item).find("div.post_info");
      if (div.length === 0) {
         $(item).find(".post_controls:first")
                  .after('<div class="post_info">' +
                         '<span class="MissingE_timestamp" ' +
                         'style="font-weight:normal;">' +
                         getLocale(lang).loading +
                         '</span></div>');
      }
      else {
         var spn = div.find('span.MissingE_timestamp');
         if (spn.length === 0) {
            div.append('<br><span class="MissingE_timestamp" ' +
                       'style="font-weight:normal;">' +
                       getLocale(lang).loading +
                       '</span>');
         }
         else {
            spn.text(getLocale(lang).loading);
         }
      }
      safari.self.tab.dispatchMessage("timestamp", {pid: tid, url: addr,
                                                    lang: lang, stamp: stamp,
                                                    type: type});
   }
}

function receiveTimestamp(response) {
   var info;
   if (response.name !== "timestamp") { return; }
   if (response.message.success) {
      info = $('#post_' + response.message.pid)
                     .find('span.MissingE_timestamp');
      info.text(response.message.data);
   }
   else {
      info = $('#post_' + response.message.pid)
                     .find('span.MissingE_timestamp');
      var failHTML = 'Timestamp loading failed.';
      if (/^\/(inbox|messages|submissions)/.test(location.pathname) ||
          /^\/blog\/[^\/]*\/(messages|submissions)/
            .test(location.pathname)) {
         failHTML += ' <a class="MissingE_timestamp_retry" href="#" ' +
                     'onclick="return false;">Retry</a>';
      }
      info.html(failHTML);
   }
}

function MissingE_timestamps_doStartup() {
   safari.self.addEventListener("message", receiveTimestamp, false);
   if (!(/drafts$/.test(location.href)) &&
       !(/queue$/.test(location.href))) {

      $('head').append('<style type="text/css">' +
                       'span.MissingE_timestamp a {' +
                       'text-decoration:none !important } ' +
                       'span.MissingE_timestamp a:hover { ' +
                       'text-decoration:underline !important; }' +
                       '</style>');
      $('#posts li.post div.post_info a.MissingE_timestamp_retry')
            .live('click',function() {
         var post = $(this).closest('li.post');
         if (post.length === 1) {
            loadTimestamp($(this).parents('li.post').get(0));
         }
      });
      $('#posts li.post').each(function(){ loadTimestamp(this); });
      $(document).bind('MissingEajax',function(e) {
         if (e.originalEvent.data.type === 'notes') { return; }
         $.each(e.originalEvent.data.list, function(i,val) {
            loadTimestamp($('#'+val).get(0));
         });
      });
   }
}
