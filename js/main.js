/* Salt to use when hashing answers. Chosen at random. */
const FLAG_SALT = "qIg4puPBff42gHq5THKe+g==";

/* Hashes of the correct answers to each question.
 *
 * These digests were computed using SHA-512 and using the above salt.
 * 
 * Note, if you'd like to add an answer for a question, you can compute the
 * hash like this; Open your browser console (press F12) and type:
 *
 *   bytesToBase64(await getDigest("flag_{yOuR_fL4G_h3rE}"))
 *
 * While you're on the https://49sd.com/challenges.html page.
*/
const FLAG_DIGESTS = {
	q1:	"/U48F6ev94GonIyE521hmTm2VYvGsnNNAGTkcb9CqBov"+
		"R8YQvXOn+u8XlluE4ROsy8BF0LqQ8a1vwHtoFjwFYg==",
	q2:	"8ikYFEx3V2Y3FBnyV59kJ+YjjoUnXGeE1VNhd4T/pfod"+
		"/nWxHxJfLFhnb4dJ+q4lBS9M0qBSCGWqCh6hr8jnqg==",
	q3_1:	"Ch9e8bahBsqR3vnLmh1f+7EqYf7ivyfCd0GoaAVWPPmw"+
		"ivro60H3o2G1uZI8noX/K2ZHEFa2IRwA4bwC1mmJuQ==",
	q3_2:	"6LT5WAyZL8i3xjDxftp+hOpE13QETa/DoMCytefr22iv"+
		"R5M1wOHm0lwTnbk49PRktBlfsXam1RAutuFlcKrxBA==",
	q3_3:	"9iJVM+vRKqAtSXpmDCpCjPEPuAO4wsUl5ZT9OOsoh/xk"+
		"JLX/wGAPtX94+DEhDdYxAP37X31iIcLfV7cbGmphgg==",
	q3_4:	"SD6V4dvnohaO/bYa8rootej6t91JieH9M1bFFuaf+gWy"+
		"tSEyMD1ja0MxqEBUKVYoBaZn0Ay7c7wzyr3N1L/Opw==",
	q3_5:	"JwBtGiS5S5PWV0G1OSXsTZG2OBSobj65oQMfWVEaOvCP"+
		"flQwf6vsmlnkqpMj0LpO9uWYbiEG4PWOCpwrQMsEdw==",
	q4:     "rSisWE68iSM7xn9+6+ReJHxjCNmFUV8BR+X+RIriWSf7AFqBXq89flwbrAX6ZqVMDVO0wUpZq6ajsjDVtuAPfw=="
};

/* Convert from a Base64 string to a raw Uint8Array.
 *
 * This function is from
 * https://developer.mozilla.org/en-US/docs/Glossary/Base64. 
*/
function base64ToBytes(base64) {
	const binString = atob(base64);
	return Uint8Array.from(binString, (m) => m.codePointAt(0));
}

/* Convert from a raw Uint8Array to a Base64 string.
 *
 * This function is from
 * https://developer.mozilla.org/en-US/docs/Glossary/Base64. 
*/
function bytesToBase64(bytes) {
	const binString = String.fromCodePoint(...bytes);
	return btoa(binString);
}

/* Check whether two Uint8Arrays are equal. */
function digestsAreEqual(a, b) {
	return a.length === b.length && a.every((elem, idx) => elem === b[idx]);
}

/* Compute the hash for a flag.
 *
 * We use a salt to avoid a precomputed table attack.
 * https://en.wikipedia.org/wiki/Rainbow_table
*/
async function getDigest(flag) {
	var enc = new TextEncoder();
	var flag_enc = enc.encode(flag);
	var salt = base64ToBytes(FLAG_SALT);

	var data = new Uint8Array(flag_enc.length + salt.length);
	data.set(flag_enc);
	data.set(salt, flag_enc.length);

	var digest = await crypto.subtle.digest('SHA-512', data);

	return new Uint8Array(digest);
}

$(document).ready(function(){
	$('.ddown').click(function(){
		$(this).find('i').toggleClass('fa-chevron-down fa-chevron-up');
		$(this).find('div').slideToggle(500);
	})

	$('#accordion, #log-analysis-accordion').accordion({
		collapsible: true,
		active: false,
		heightStyle: 'content',
		animate: {
			duration: 400
		}
	});

	async function checkFlag(object) {
		var id = $(object).attr('id');
		var flag = $(object).prev('input').val();

		if (id === 'q4') {
			if (flag === 'h3Ll0_b0B') { // Direct comparison for q4
				alert('Congrats! You have completed this challenge.');
				$(object).prev('input').attr('placeholder', 'Correct!');
			} else {
				$(object).prev('input').attr('placeholder', 'Incorrect');
			}
		} else {
			// Original digest-based checking for other questions
			var digest = await getDigest(flag);
			var correct_digest = base64ToBytes(FLAG_DIGESTS[id]);

			$(object).prev('input').val('');

			if (digestsAreEqual(digest, correct_digest)) {
				alert('Congrats! You have completed this challenge.');
				$(object).prev('input').attr('placeholder', 'Correct!');
			} else {
				$(object).prev('input').attr('placeholder', 'Incorrect');
			}
		}
	}
	
	$('.ctf-submit').click(function(){
		checkFlag($(this));
	})

	$('.ctf-hint').click(function(){
		$(this).next('p').toggle();
	})
});
