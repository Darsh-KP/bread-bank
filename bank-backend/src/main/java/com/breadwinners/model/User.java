package com.breadwinners.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.DynamicUpdate;

@Entity
@NoArgsConstructor(force = true)
@DynamicUpdate  //Dynamic Update added to optimize SQL for Patch/updates to one field
@Getter
@Setter
@EqualsAndHashCode(of = "username")
@Table(name = "users")
public class User {
    @Id
    @Column(length = 50)
    @Getter @Setter
    private String username;

    @Column(name = "password_hash", length = 254, nullable = false)
    @Getter @Setter
    private String passwordHash;

    @Column(name = "first_name", length = 30, nullable = false)
    @Getter @Setter
    private String firstName;

    @Column(name = "last_name", length = 30, nullable = false)
    @Getter @Setter
    private String lastName;

    @Column(length = 254, nullable = false, unique = true)
    @Getter @Setter
    private String email;

    @Column(length = 20, nullable = false, unique = true)
    @Getter @Setter
    private String phone;

    public User(String username, String passwordHash, String firstName, String lastName, String email, String phone) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
    }
}
