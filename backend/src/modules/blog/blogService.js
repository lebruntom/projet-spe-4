import {db} from "../../index.js";

// Fonction pour ajouter un article au blog
export function addBlog(email, subject, title, status) {
    // Insertion d'un nouvel article dans la table blog
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO blog (email, subject, title, status) VALUES (?, ?, ?, ?)",
            [email, subject, title, status],
            (err) => {
                if (err) {
                    reject(new Error("Error impossible to create blog" + err));
                } else {
                    resolve("blog add successfully");
                }
            }
        );
    });
}

export function deleteBlog(blogId) {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM blog WHERE id = ?", [blogId], (err) => {
            if (err) {
                reject(new Error("Error: Unable to delete blog entry" + err));
            } else {
                resolve("Blog entry deleted successfully");
            }
        });
    });
}

// Fonction pour mettre à jour un article du blog
export function updateBlogEntry(blogId, newSubject, newTitle, newStatus) {
    return new Promise((resolve, reject) => {
        db.run(
            "UPDATE blog SET subject = ?, title = ?, status = ? WHERE id = ?",
            [newSubject, newTitle, newStatus, blogId],
            (err) => {
                if (err) {
                    reject(new Error("Error: Unable to update blog entry" + err));
                } else {
                    resolve("Blog entry updated successfully");
                }
            }
        );
    });
}

export function findAllBlog() {
    return new Promise((resolve, reject) => {
        db.all(
            "SELECT * FROM blog where status = 1 order by created_at desc",
            (err, rows) => {
                if (err) {
                    reject(new Error("Error: Unable to retrieve blog entries" + err));
                } else {
                    resolve(rows);
                }
            }
        );
    });
}

export function findAllBlogPrivate() {
    return new Promise((resolve, reject) => {
        db.all(
            "SELECT * FROM blog where status = 0 order by created_at desc",
            (err, rows) => {
                if (err) {
                    reject(new Error("Error: Unable to retrieve blog entries" + err));
                } else {
                    resolve(rows);
                }
            }
        );
    });
}

export function findFiveLastBlog() {
    return new Promise((resolve, reject) => {
        db.all(
            "SELECT * FROM blog where status = 1 order by created_at desc limit 5",
            (err, rows) => {
                if (err) {
                    reject(new Error("Error: Unable to retrieve blog entries" + err));
                } else {
                    resolve(rows);
                }
            }
        );
    });
}

export function findMyBlogs(email) {
    return new Promise((resolve, reject) => {
        db.all(
            "SELECT * FROM blog where email=?  order by created_at desc",
            [email],
            (err, rows) => {
                if (err) {
                    reject(new Error("Error: Unable to retrieve blog entries" + err));
                } else {
                    resolve(rows);
                }
            }
        );
    });
}
