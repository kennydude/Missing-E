/*
 * 'Missing e' Extension
 *
 * Copyright 2011, Jeremy Cutler
 * Released under the GPL version 3 licence.
 * SEE: license/GPL-LICENSE.txt
 *
 * This file is part of 'Missing e'.
 *
 * 'Missing e' is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
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

(function(){
   if (window.top === window ||
       MissingE.isTumblrURL(location.href, ["askForm", "fanMail"])) {
      extension.sendRequest("earlyStyles", {url: location.href},
                            function(response) {
         var i;
         if (response.hasOwnProperty("styles")) {
            for (i=0; i<response.styles.length; i++) {
               if (response.styles[i].file) {
                  extension.insertStyleSheet(response.styles[i].file);
               }
               if (response.styles[i].code) {
                  extension.insertStyle(response.styles[i].code);
               }
            }
         }
      });
   }
}());
