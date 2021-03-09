# Amazon Photos Clone

## API Request Types

### 1. Create
Endpoint: `/photos/create/`__
Request Type: `POST`__
Required Body:
```
{
  photoUrl1: STRING, (REQUIRED)
  photoUrl2: STRING,
  photoUrl3: STRING,
  photoUrl4: STRING,
  photoUrl5: STRING,
  photoUrl6: STRING,
  photoUrl7: STRING,
}
```
### 2. Read
Endpoint: `/photos/id/:productId`__
Request Type: `GET`__
### 3. Update
Endpoint: `/photos/update/:productId`__
Request Type: `PUT`__
Required Body: (only include headers for desired updates)
```
{
  photoUrl1: STRING,
  photoUrl2: STRING,
  photoUrl3: STRING,
  photoUrl4: STRING,
  photoUrl5: STRING,
  photoUrl6: STRING,
  photoUrl7: STRING,
}
```
### 4. Delete
Endpoint: `/photos/delete/:productId`__
Request Type: `DELETE`__