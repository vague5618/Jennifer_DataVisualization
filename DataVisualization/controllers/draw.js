/**
 * Created by JAY on 2016. 7. 19..
 */

module.exports.index = function (req, res) {
    var obj = req.body;
    var url = obj.inputUrl;
    var path = obj.inputJSONPath;
    var formData = JSON.parse(obj.formData);

    res.render('draw', {title: 'Draw', url: url, path: path, formData: formData});
};