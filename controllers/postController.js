"use strict"

const express = require("express");
//const posts = require("../data/posts");
const connection = require("../connection");
const router = express.Router();



//read:  visualizzazione tutti elementi (index)
function index(req, res) {
    const sql = "SELECT * FROM `posts`"
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database query failed" });
        // console.log(results);
        let data = results;
        const response = {
            totalCount: results.length,
            data,
        }
        res.json(response)
    })
    // const allPosts = [...posts];
    // res.json(allPosts)
};

//read:  visualizzazione 1 elemento (show)
function show(req, res) {
    const id = parseInt(req.params.id);
    const sql = "SELECT * FROM `posts` WHERE `id` = ?"
    //const onePost = posts.find((element) => element.id === id);
    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: "database query failed" })
        //console.log(results)
        const item = results[0];
        if (!item) {
            return res.status(404).json({ error: "L'elemento non esiste" });
        }
        const sqltags = `SELECT tags.id, tags.name FROM ingredients
        JOIN tags_post ON tags_post.tag_id = tags.id
        WHERE tags_post.post_id = ?`;
        connection.query(sqltags, [id], (err, results) => {
            console.log(results);
            if (err) return res.status(500).json({ error: "Database query failed" });
            item.tags = results;
            res.json(response)
        });

        // if (onePost) {
        //     res.json({
        //         success: true,
        //         onePost,
        //     });
        // } else {
        //     res.status(404);
        //     res.json({
        //         success: false,
        //         message: "il post non esiste",
        //     });
        // };
    })
};

//create:  creazione 1 elemento (store)
function store(req, res) {
    let newId = 0;
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id > newId) {
            newId = posts[i].id;
        }
    }
    newId += 1;
    const newPost = {
        id: newId,
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags,
        published: req.body.published,
    };
    posts.push(newPost);
    console.log(posts);
    res.status(201).json(newPost);
};

//update:  modifica interamente 1 elemento (update)
function update(req, res) {
    const id = parseInt(req.params.id);
    const item = posts.find((element) => element.id === id);
    if (!item) {
        res.status(404).json({
            success: false, message: "il post non esiste"
        });
        return;
    }
    console.log(req.body);
    for (let i in item) {
        if (i !== "id") {
            item[i] = req.body[i];
        }
    }
    console.log(posts);
    res.json(item);
};

//update:  modifica parzialmente 1 elemento (modify)
function modify(req, res) {
    const id = parseInt(req.params.id);
    const item = posts.find((element) => element.id === id);
    if (!item) {
        res.status(404).json({
            success: false, message: "il post non esiste"
        });
        return;
    }
    console.log(req.body);
    for (let i in item) {
        if (i !== "id") {
            item[i] = req.body[i];
        }
    }
    console.log(posts);
    res.json(item);
};

//delete:  eliminazione 1 elemento (destroy)
function destroy(req, res) {
    const id = parseInt(req.params.id);
    const onePost = posts.find((element) => element.id === id);
    const sql = "DELETE * FROM `posts` WHERE `id` = ?"
    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: "database query failed" })
        res.sendStatus(204);
    });
}

module.exports = {
    index,
    show,
    store,
    update,
    modify,
    destroy,
}
